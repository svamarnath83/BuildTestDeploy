'use client';

import type { VoyagePortCall } from '../libs/voyage-models';
import { PortCallService } from '../libs/port-call-service';
import { toInputDateTime } from '../libs/date-utils';
import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { DropdownField, Option, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@commercialapp/ui';
import type { Port } from '@commercialapp/ui/libs/registers/ports/models';

interface PortCallListProps {
  portCalls: VoyagePortCall[];
  onReorder?: (reordered: VoyagePortCall[]) => void;
  onChange?: (index: number, field: keyof VoyagePortCall, value: any, updated: VoyagePortCall) => void;
  onAddPortCall?: (index: number) => void;
  onRemovePortCall?: (id: number) => void;
  onSave?: (rows: VoyagePortCall[]) => void;
}

const ACTIVITY_OPTIONS = ['Ballast', 'Load', 'Discharge', 'Canal', 'Bunker', 'Owners Affairs'];
const CALCULATION_FIELDS = ['speed', 'portDays', 'arrival', 'departure', 'distance'];

// Reusable input field component
const InputField = ({ 
  value, 
  onChange, 
  type = 'text', 
  className = '', 
  hasError = false,
  ...props 
}: {
  value: any;
  onChange: (value: any) => void;
  type?: string;
  className?: string;
  hasError?: boolean;
  [key: string]: any;
}) => (
  <div className={`h-7 px-2 py-1 bg-white rounded border-b transition-colors duration-200 flex items-center ${hasError ? 'border-red-500 focus-within:border-red-600' : 'border-gray-300 focus-within:border-b-2 focus-within:border-blue-500'} ${className}`}>
    <input
      type={type}
      className="w-full bg-transparent border-none outline-none text-xs text-gray-600"
      value={value ?? ''}
      // Pass raw input value to handler so component can keep natural typing behavior
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  </div>
);

// Port call row component
function PortCallRow({ 
  item, 
  id, 
  rowIndex, 
  ports,
  validationErrors,
  onFieldChange,
  onRemovePortCall,
  getCurrentPortOption,
  mapPortToOption
}: {
  item: VoyagePortCall;
  id: string;
  rowIndex: number;
  ports: Port[];
  validationErrors: any[];
  onFieldChange: (rowIndex: number, field: keyof VoyagePortCall, value: any) => void;
  onRemovePortCall?: (id: number) => void;
  getCurrentPortOption: (portName?: string) => Option | null;
  mapPortToOption: (port: Port) => Option;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? '#F5F7FF' : undefined
  };
  
  const portErrors = validationErrors.filter(error => error.portCallId === item.id);
  const hasErrors = portErrors.length > 0;
  const isDraggable = item.activity !== 'Ballast';
  
  const update = (field: keyof VoyagePortCall, value: any) => {
    onFieldChange(rowIndex, field, value);
  };

  

  return (
    <tr ref={setNodeRef} style={style} className={`group transition-all duration-200 ease-in-out border-l-4 ${hasErrors ? 'border-l-red-400' : 'border-l-transparent hover:border-l-blue-400'} ${rowIndex % 2 === 0 ? 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50' : 'bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'}`}>
      <td className={`px-2 py-2 w-6 ${isDraggable ? 'text-gray-400 cursor-grab' : 'text-gray-300 cursor-not-allowed'}`} 
          {...(isDraggable ? { ...attributes, ...listeners } : {})} 
          title={isDraggable ? 'Drag to reorder' : 'Ballast ports cannot be moved'}>
        <GripVertical className="w-3 h-3" />
      </td>
      
      <td className="px-2 py-1 font-medium text-gray-900 truncate w-48" title={item.portName}>
        <div className="w-44">
          <DropdownField
            value={getCurrentPortOption(item.portName)}
            data={ports}
            mapToOption={mapPortToOption}
            onChange={(opt) => update('portName', opt ? (opt.value as string) : '')}
            placeholder="Select port"
            className="w-36"
            controlMinHeight={28}
          />
        </div>
      </td>
      
      <td className="px-2 py-1 text-gray-700 truncate">
        <div className="w-36">
          <Select value={item.activity || ''} onValueChange={(v) => update('activity', v)}>
            <SelectTrigger className="w-36 h-7 text-xs">
              <SelectValue placeholder="Select activity" />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_OPTIONS.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </td>
      
      <td className="px-2 py-1 text-gray-700 whitespace-nowrap">
        <InputField
          type="datetime-local"
          value={toInputDateTime(item.arrival)}
          onChange={(v) => update('arrival', v)}
          hasError={portErrors.some(e => e.field === 'arrival')}
          className="w-40"
          lang="en-GB"
        />
      </td>
      
      <td className="px-2 py-1 text-gray-700 whitespace-nowrap w-40">
        <InputField
          type="datetime-local"
          value={toInputDateTime(item.departure)}
          onChange={(v) => update('departure', v)}
          hasError={portErrors.some(e => e.field === 'departure')}
          className="w-40"
          lang="en-GB"
        />
      </td>
      
      <td className="px-2 py-1 text-gray-700 text-right whitespace-nowrap">
        <InputField
          type="number"
          value={item.distance}
          onChange={(v) => update('distance', v)}
          hasError={portErrors.some(e => e.field === 'distance')}
          className="w-20 ml-auto"
        />
      </td>
      
      <td className="px-2 py-1 text-gray-700 text-right whitespace-nowrap">
        <InputField
          type="number"
          value={item.portDays}
          onChange={(v) => update('portDays', v)}
          hasError={portErrors.some(e => e.field === 'portDays')}
          className="w-16 ml-auto"
        />
      </td>
      
      <td className="px-2 py-1 text-gray-700 text-right whitespace-nowrap">
        <InputField
          type="number"
          value={item.speed}
          onChange={(v) => update('speed', v)}
          hasError={portErrors.some(e => e.field === 'speed')}
          className="w-16 ml-auto"
          step="0.1"
        />
      </td>
      
      <td className="px-2 py-2 text-gray-700 truncate" title={item.steamDays?.toString()}>
        {item.steamDays ?? '-'}
      </td>
      
      <td className="px-2 py-2 text-gray-700 truncate" title={item.chartererAgent}>
        {item.chartererAgent ?? '-'}
      </td>
      
      <td className="px-2 py-2 text-gray-700 truncate" title={item.ownerAgent}>
        {item.ownerAgent ?? '-'}
      </td>
      
      <td className="px-2 py-2 text-gray-700 truncate" title={item.operator}>
        {item.operator ?? '-'}
      </td>
      
      <td className="px-2 py-1 text-gray-700 whitespace-nowrap w-40">
        <InputField
          type="datetime-local"
          value={toInputDateTime(item.berthDate as any)}
          onChange={(v) => update('berthDate', v)}
          className="w-40"
          lang="en-GB"
        />
      </td>
      
      <td className="px-2 py-1 text-gray-700 text-right whitespace-nowrap">
        <InputField
          type="number"
          value={item.portCost}
          onChange={(v) => update('portCost', v)}
          className="w-24 ml-auto"
        />
      </td>
      
      <td className="px-2 py-1 text-gray-700 text-right whitespace-nowrap">
        <InputField
          type="number"
          value={item.cargoCost}
          onChange={(v) => update('cargoCost', v)}
          className="w-24 ml-auto"
        />
      </td>
      
      <td className="px-3 py-1 flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => onRemovePortCall?.(item.id ?? rowIndex)}
          className="group relative transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 rounded-md p-1 w-6 h-6 flex items-center justify-center"
          title={`Remove ${item.portName || item.activity}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="M6 6 18 18" />
          </svg>
        </button>
      </td>
    </tr>
  );
}

export default function PortCallList({ portCalls, onReorder, onChange, onAddPortCall, onRemovePortCall, onSave }: PortCallListProps) {
  const [rows, setRows] = useState<VoyagePortCall[]>(portCalls || []);
  const rowsRef = useRef<VoyagePortCall[]>(rows);
  const [ports, setPorts] = useState<Port[]>([]);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [isRecalculating, setIsRecalculating] = useState(false);
  // validationErrors: { portCallId: number, field: string, message: string }

  // Load ports on mount
  React.useEffect(() => {
    PortCallService.loadPorts().then(setPorts);
  }, []);

  // Sync with props
  React.useEffect(() => {
    // Ensure every incoming row has an id to avoid id/index ambiguity
    const incoming = portCalls || [];
    const normalized = incoming.map(r => {
      // Treat null/undefined/0 as missing id and assign a generated temporary id
      if (!r || r.id == null || r.id === 0) {
        return { ...r, id: PortCallService.generatePortCallId() };
      }
      return r;
    });
    setRows(normalized);
  }, [portCalls]);

  // When parent-controlled portCalls change, clear recalculating state
  React.useEffect(() => {
    setIsRecalculating(false);
  }, [portCalls]);

  // keep a ref in sync for callbacks that need latest rows synchronously
  React.useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => PortCallService.cleanup();
  }, []);

  const mapPortToOption = useCallback(PortCallService.mapPortToOption, []);
  const getCurrentPortOption = useCallback((portName?: string) => PortCallService.getCurrentPortOption(portName, ports), [ports]);

  // Handle field changes
  const handleFieldChange = useCallback((
    rowIndex: number, 
    field: keyof VoyagePortCall, 
    value: any
  ) => {
    if (CALCULATION_FIELDS.includes(field)) {
      // For date fields (arrival/departure) apply recalculation immediately so departure updates visibly
      if (field === 'arrival' || field === 'departure') {
        // Cancel pending debounced recalculations to avoid race where a pending timeout overwrites this immediate change
        PortCallService.cleanup();

        // Perform authoritative recalculation synchronously and update UI
        const updatedRows = PortCallService.recalculateAfterFieldChange(rows, rowIndex, field, value);
        setRows(updatedRows);
        onChange?.(rowIndex, field, value, updatedRows[rowIndex]);
      } else {
        // Optimistic local update so the input remains responsive while debounced recalculation runs
        const optimisticRows = PortCallService.updatePortCallField(rows, rowIndex, field, value);
        setRows(optimisticRows);
        onChange?.(rowIndex, field, value, optimisticRows[rowIndex]);

        setIsRecalculating(true);
        PortCallService.debouncedUpdate(
          rowIndex,
          field,
          value,
          optimisticRows,
          (updatedRows) => {
            setRows(updatedRows);
            onChange?.(rowIndex, field, value, updatedRows[rowIndex]);
            setIsRecalculating(false);
          },
          false // allow the debounced handler to run (we already marked UI as recalculating)
        );
      }
    } else {
      const updatedRows = PortCallService.updatePortCallField(rows, rowIndex, field, value);
      setRows(updatedRows);
      onChange?.(rowIndex, field, value, updatedRows[rowIndex]);
    }
  }, [onChange, rows, isRecalculating]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const ids = useMemo(() => rows.map((r, i) => `${r.voyageId ?? 'v'}-${r.sequenceOrder ?? i + 1}-${r.portName ?? 'port'}-${r.portId ?? 'pid'}-${i}`), [rows]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const oldIndex = ids.findIndex(x => x === active.id);
    const newIndex = ids.findIndex(x => x === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    
    const result = PortCallService.reorderPortCalls(rows, oldIndex, newIndex);
    if (result.success) {
      setRows(result.portCalls);
      onReorder?.(result.portCalls);
    }
  };

  // Provide a remove handler that falls back to simple filtering when needed
  const handleRemove = useCallback((identifier: number) => {
    // If parent handles removal, delegate
    console.log('handleRemove called with identifier:', identifier);
    if (onRemovePortCall) {
      // Controlled mode: delegate removal to parent and show recalculating state until props update
      setIsRecalculating(true);
      onRemovePortCall(identifier);
      return;
    }
    // Cancel any pending debounced recalculations to avoid races
    PortCallService.cleanup();

    const currentRows = rowsRef.current;

    // Determine whether identifier is an id (matches a row) or an index fallback
    let targetIndex = currentRows.findIndex(pc => pc.id === identifier);
    // If not found by id, and identifier is a valid index in range, use that
    if (targetIndex === -1 && Number.isInteger(identifier) && identifier >= 0 && identifier < currentRows.length) {
      targetIndex = identifier;
    }
    // If still not found, nothing to remove
    if (targetIndex === -1) return;

    // Compute the filtered list locally first to avoid unexpected service behavior
    const filtered = currentRows.filter((_, i) => i !== targetIndex).map((r, i) => ({ ...r, sequenceOrder: i + 1 }));

    setIsRecalculating(true);
    try {
      // If removing left zero rows, set empty state without calling recalculation
      if (filtered.length === 0) {
        setRows([]);
        onReorder?.([]);
        return;
      }

      // For non-empty lists, delegate to the calculation service for authoritative recalculation
      // Pass the original identifier (prefer id when available)
      const idToPass = currentRows[targetIndex]?.id ?? undefined;
      const updated = typeof idToPass !== 'undefined' ? PortCallService.removePortCall(currentRows, idToPass) : null;
      if (Array.isArray(updated) && updated.length === filtered.length) {
        setRows(updated);
        onReorder?.(updated);
      } else {
        // Fallback: use locally computed filtered list
        setRows(filtered);
        onReorder?.(filtered);
      }
    } catch (err) {
      console.error('Error removing port call:', err);
      setRows(filtered);
      onReorder?.(filtered);
    } finally {
      setIsRecalculating(false);
    }
  }, [onRemovePortCall, onReorder, rows]);

  // Validate rows before save
  const validateRows = useCallback((rowsToValidate: VoyagePortCall[]) => {
    const errors: { portCallId: number; field: string; message: string }[] = [];

    for (let i = 0; i < rowsToValidate.length; i++) {
      const row = rowsToValidate[i];
      const id = row.id ?? i; // fallback id for temporary rows

      // Skip empty row
      if (!row) continue;

      // arrival must be before departure for the same port (if both provided)
      if (row.arrival && row.departure) {
        const arrivalMs = new Date(row.arrival).getTime();
        const departureMs = new Date(row.departure).getTime();
        if (isNaN(arrivalMs) || isNaN(departureMs) || arrivalMs >= departureMs) {
          errors.push({ portCallId: id, field: 'arrival', message: 'Arrival must be before departure' });
          errors.push({ portCallId: id, field: 'departure', message: 'Departure must be after arrival' });
        }
      }

      // For ports after the first, arrival must be greater than previous port's departure
      if (i > 0) {
        const prev = rowsToValidate[i - 1];
        if (row.arrival && prev && prev.departure) {
          const arrivalMs = new Date(row.arrival).getTime();
          const prevDepartureMs = new Date(prev.departure).getTime();
          if (!isNaN(arrivalMs) && !isNaN(prevDepartureMs) && arrivalMs <= prevDepartureMs) {
            errors.push({ portCallId: id, field: 'arrival', message: 'Arrival must be after previous port departure' });
          }
        }
      }

      // Distance must not be 0 for ports except Ballast
      if (row.activity !== 'Ballast') {
        const distanceVal = Number(row.distance ?? 0);
        if (!distanceVal || distanceVal === 0) {
          errors.push({ portCallId: id, field: 'distance', message: 'Distance must be greater than 0 for non-ballast ports' });
        }
      }
    }

    return errors;
  }, []);

  const handleSave = useCallback(() => {
    const errs = validateRows(rows);
    setValidationErrors(errs);
    if (errs.length > 0) {
      // keep UI focused on errors
      return false;
    }
    // no errors -> call onSave if provided
    if (typeof onChange === 'function') {
      // Ensure any pending debounced updates are applied
      PortCallService.cleanup();
    }
    if (onChange == null && typeof onSave === 'function') {
      onSave(rows);
    } else if (typeof onSave === 'function') {
      onSave(rows);
    }
    return true;
  }, [rows, validateRows, onSave, onChange]);

  // removal handled by parent via prop; keep pass-through behavior

  const handleAddPortCall = useCallback(() => {
    if (onAddPortCall) {
      onAddPortCall(rows.length - 1);
      return;
    }
    
    setIsRecalculating(true);
    try {
      const updatedRows = PortCallService.addPortCall(rows);
      setRows(updatedRows);
    } catch (error) {
      console.error('Error adding new port call:', error);
    } finally {
      setIsRecalculating(false);
    }
  }, [rows, onAddPortCall]);

  return (
    <div className="w-full h-full overflow-auto p-3">
      {isRecalculating && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-xs text-blue-700">Recalculating voyage schedule...</span>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <div className="bg-white p-3 shadow-sm">
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              <table className="min-w-[1600px] w-full border border-gray-200">
                <thead>
                  <tr className="text-xs font-medium text-gray-600 bg-gray-50">
                    <th className="px-2 py-2 w-6" />
                    <th className="text-left px-2 py-2 w-48">Port</th>
                    <th className="text-left px-2 py-2">Activity</th>
                    <th className="text-left px-2 py-2">Arrival</th>
                    <th className="text-left px-2 py-2 w-40">Departure</th>
                    <th className="text-right px-2 py-2">Distance</th>
                    <th className="text-right px-2 py-2">Port Days</th>
                    <th className="text-right px-2 py-2">Speed</th>
                    <th className="text-right px-2 py-2">Steam Days</th>
                    <th className="text-left px-2 py-2">Charterer Agent</th>
                    <th className="text-left px-2 py-2">Owner Agent</th>
                    <th className="text-left px-2 py-2">Operator</th>
                    <th className="text-left px-2 py-2 w-40">Berth Date</th>
                    <th className="text-right px-2 py-2 whitespace-nowrap">Port Cost</th>
                    <th className="text-right px-2 py-2 whitespace-nowrap">Cargo Cost</th>
                    <th className="text-left px-3 py-2 w-20">
                      <div className="flex gap-2 items-center justify-end">
                        <button
                          type="button"
                          onClick={handleAddPortCall}
                          className="group relative transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 rounded-md p-1 w-6 h-6 flex items-center justify-center"
                          title="Add port call"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"/>
                            <path d="M12 5v14"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          className="group relative transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 hover:border-green-300 rounded-md p-1 w-6 h-6 flex items-center justify-center"
                          title="Save port calls"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"/>
                            <path d="M12 5v14"/>
                          </svg>
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {rows.map((pc, idx) => (
                    <PortCallRow 
                      key={ids[idx]} 
                      id={ids[idx]} 
                      item={pc} 
                      rowIndex={idx}
                      ports={ports}
                      validationErrors={validationErrors}
                      onFieldChange={handleFieldChange}
                      onRemovePortCall={handleRemove}
                      getCurrentPortOption={getCurrentPortOption}
                      mapPortToOption={mapPortToOption}
                    />
                  ))}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}