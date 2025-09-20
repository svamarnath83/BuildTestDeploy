import type { VoyagePortCall } from './voyage-models';
import { PortCallCalculationService, type ValidationError } from './port-call-calculations';
import { getPort } from '@commercialapp/ui/libs/registers/ports/services';
import type { Port } from '@commercialapp/ui/libs/registers/ports/models';
import { Option } from '@commercialapp/ui';

/**
 * Service for managing port call operations
 */
export class PortCallService {
  private static debounceTimeouts: Record<string, NodeJS.Timeout> = {};

  /**
   * Load ports from API
   */
  static async loadPorts(): Promise<Port[]> {
    try {
      const res = await getPort();
      return res.data || [];
    } catch (e) {
      console.error('Failed to load ports', e);
      return [];
    }
  }

  /**
   * Map port to option for dropdown
   */
  static mapPortToOption(port: Port): Option {
    return { value: port.Name, label: port.Name };
  }

  /**
   * Get current port option from port name
   */
  static getCurrentPortOption(portName: string | undefined, ports: Port[]): Option | null {
    if (!portName) return null;
    const port = ports.find(p => p.Name === portName);
    return port ? this.mapPortToOption(port) : null;
  }

  /**
   * Generate unique ID for port call
   */
  static generatePortCallId(): number {
    return Math.floor(Math.random() * 1_000_000) * -1;
  }

  /**
   * Create a new port call
   */
  static createPortCall(previousPort?: VoyagePortCall): VoyagePortCall {
    // Create a new port call with only voyageId, leave other fields empty for calculation
    const voyageId = previousPort?.voyageId || 1;
    const newPortCall = PortCallCalculationService.createDefaultPortCall(voyageId);
  // Set speed, distance, portDays to 0 so they are editable and calculations can handle them
  (newPortCall as any).speed = 0;
  (newPortCall as any).distance = 0;
  (newPortCall as any).portDays = 0;
    return {
      ...newPortCall,
      id: this.generatePortCallId(),
    };
  }

  /**
   * Add port call to list
   */
  static addPortCall(portCalls: VoyagePortCall[]): VoyagePortCall[] {
    if (portCalls.length === 0) return portCalls;
    
    const previousPort = portCalls[portCalls.length - 1];
    const newPortCall = this.createPortCall(previousPort);
    
    const updatedRows = [...portCalls, newPortCall].map((r, i) => ({ ...r, sequenceOrder: i + 1 }));
    return PortCallCalculationService.recalculateAfterSequenceChange(updatedRows);
  }

  /**
   * Remove port call from list
   */
  static removePortCall(portCalls: VoyagePortCall[], portCallId: number): VoyagePortCall[] {
    // Remove the port call, resequence, then run the sequence recalculation
    const filtered = portCalls.filter(pc => pc.id !== portCallId).map((r, i) => ({ ...r, sequenceOrder: i + 1 }));
    return PortCallCalculationService.recalculateAfterSequenceChange(filtered);
  }

  /**
   * Update port call field
   */
  static updatePortCallField(
    portCalls: VoyagePortCall[],
    rowIndex: number,
    field: keyof VoyagePortCall,
    value: any
  ): VoyagePortCall[] {
    const updatedRows = [...portCalls];

    // Coerce numeric fields coming from UI inputs (which often send strings)
    const numericFields = ['speed', 'distance', 'portDays'];
    let finalValue: any = value;

    if (numericFields.includes(field as string)) {
      // Treat empty/null/undefined as 0 so inputs remain editable and calculations don't break
      if (finalValue === '' || finalValue === null || finalValue === undefined) {
        finalValue = 0;
      } else {
        const num = Number(finalValue);
        finalValue = Number.isNaN(num) ? 0 : num;
      }
    }

    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: finalValue };
    return updatedRows;
  }

  /**
   * Recalculate port calls after field change
   */
  static recalculateAfterFieldChange(
    portCalls: VoyagePortCall[],
    rowIndex: number,
    field: keyof VoyagePortCall,
    value: any
  ): VoyagePortCall[] {
    const calculationFields = ['speed', 'portDays', 'arrival', 'departure', 'distance'];
    
    if (!calculationFields.includes(field)) {
      return this.updatePortCallField(portCalls, rowIndex, field, value);
    }

    // Skip recalculation for empty date fields
    if ((field === 'arrival' || field === 'departure') && (!value || value === '')) {
      return this.updatePortCallField(portCalls, rowIndex, field, value);
    }

    let updatedRows = this.updatePortCallField(portCalls, rowIndex, field, value);

    // Apply recalculation based on field type
    switch (field) {
      case 'speed':
        return PortCallCalculationService.recalculateAfterSpeedChange(updatedRows, rowIndex);
      case 'portDays':
        return PortCallCalculationService.recalculateAfterPortDaysChange(updatedRows, rowIndex);
      case 'arrival':
        return PortCallCalculationService.recalculateAfterArrivalChange(updatedRows, rowIndex);
      case 'departure':
        return PortCallCalculationService.recalculateAfterDepartureChange(updatedRows, rowIndex);
      case 'distance':
        return PortCallCalculationService.recalculateAfterDistanceChange(updatedRows, rowIndex);
      default:
        return updatedRows;
    }
  }

  /**
   * Reorder port calls (drag and drop)
   */
  static reorderPortCalls(
    portCalls: VoyagePortCall[],
    oldIndex: number,
    newIndex: number
  ): { success: boolean; portCalls: VoyagePortCall[] } {
    const draggedPort = portCalls[oldIndex];
    const targetPort = portCalls[newIndex];

    // Validate drag operation
    if (draggedPort.activity === 'Ballast') {
      console.warn('Ballast ports cannot be moved via drag and drop');
      return { success: false, portCalls };
    }

    if (targetPort.activity === 'Ballast' && oldIndex < newIndex) {
      console.warn('Cannot move ports beyond ballast ports');
      return { success: false, portCalls };
    }

    try {
      // Reorder the ports
      const reorderedRows = portCalls.map((r, idx) => ({ ...r, sequenceOrder: idx + 1 }));
      const reordered = [...reorderedRows];
      const [removed] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, removed);
      
      // Recalculate dates based on new sequence
      const recalculatedRows = PortCallCalculationService.recalculateAfterSequenceChange(reordered);
      return { success: true, portCalls: recalculatedRows };
    } catch (error) {
      console.error('Error during drag and drop recalculation:', error);
      return { success: false, portCalls };
    }
  }

  /**
   * Validate port call sequence
   */
  static validatePortCalls(portCalls: VoyagePortCall[]): { isValid: boolean; errors: ValidationError[] } {
    return PortCallCalculationService.validatePortCallSequence(portCalls);
  }

  /**
   * Debounced update function
   */
  static debouncedUpdate(
    rowIndex: number,
    field: keyof VoyagePortCall,
    value: any,
    originalRows: VoyagePortCall[],
    onUpdate: (updatedRows: VoyagePortCall[]) => void,
    isRecalculating: boolean,
    delay: number = 500
  ): void {
    const key = `${rowIndex}-${field}`;
    
    if (this.debounceTimeouts[key]) {
      clearTimeout(this.debounceTimeouts[key]);
    }
    
    this.debounceTimeouts[key] = setTimeout(() => {
      if (isRecalculating) return;
      
      try {
        const updatedRows = this.recalculateAfterFieldChange(originalRows, rowIndex, field, value);
        onUpdate(updatedRows);
      } catch (error) {
        console.error('Error during recalculation:', error);
        const updatedRows = this.updatePortCallField(originalRows, rowIndex, field, value);
        onUpdate(updatedRows);
      }
    }, delay);
  }

  /**
   * Cleanup debounce timeouts
   */
  static cleanup(): void {
    Object.values(this.debounceTimeouts).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
    this.debounceTimeouts = {};
  }
}
