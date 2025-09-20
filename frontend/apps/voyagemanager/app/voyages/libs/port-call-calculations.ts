import { VoyagePortCall } from './voyage-models';
import {

  recalcAfterSpeedChange,
  recalcAfterPortDaysChange,
  recalcAfterArrivalChange,
  recalcAfterDepartureChange,
  recalcAfterDistanceChange,
  recalcAfterSequenceChange,
  validatePortCallSequence,
  createDefaultPortCall
} from './port-call-calculations.utils';

/**
 * Validation error interface for port call calculations
 */
export interface ValidationError {
  field: string;
  message: string;
  portCallId: number;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Port call calculation service for handling dynamic recalculation
 * of voyage schedules based on changes to port call parameters
 */
export class PortCallCalculationService {
  /**
   * Recalculates port calls after speed change
   * @param portCalls Array of port calls
   * @param changedIndex Index of the port call with changed speed
   * @returns Updated array of port calls
   */
  static recalculateAfterSpeedChange(portCalls: VoyagePortCall[], changedIndex: number): VoyagePortCall[] {
    return recalcAfterSpeedChange(portCalls, changedIndex);
  }

  /**
   * Recalculates port calls after port days change
   * @param portCalls Array of port calls
   * @param changedIndex Index of the port call with changed port days
   * @returns Updated array of port calls
   */
  static recalculateAfterPortDaysChange(portCalls: VoyagePortCall[], changedIndex: number): VoyagePortCall[] {
    return recalcAfterPortDaysChange(portCalls, changedIndex);
  }

  /**
   * Recalculates port calls after arrival date change
   * @param portCalls Array of port calls
   * @param changedIndex Index of the port call with changed arrival date
   * @returns Updated array of port calls
   */
  static recalculateAfterArrivalChange(portCalls: VoyagePortCall[], changedIndex: number, originalArrival?: string): VoyagePortCall[] {
    return recalcAfterArrivalChange(portCalls, changedIndex, originalArrival);
  }

  /**
   * Recalculates port calls after departure date change
   * @param portCalls Array of port calls
   * @param changedIndex Index of the port call with changed departure date
   * @returns Updated array of port calls
   */
  static recalculateAfterDepartureChange(portCalls: VoyagePortCall[], changedIndex: number, originalDeparture?: string): VoyagePortCall[] {
    return recalcAfterDepartureChange(portCalls, changedIndex, originalDeparture);
  }

  /**
   * Recalculates port calls after distance change
   * @param portCalls Array of port calls
   * @param changedIndex Index of the port call with changed distance
   * @returns Updated array of port calls
   */
  static recalculateAfterDistanceChange(portCalls: VoyagePortCall[], changedIndex: number): VoyagePortCall[] {
    return recalcAfterDistanceChange(portCalls, changedIndex);
  }

  /**
   * Recalculates port calls after sequence change (drag and drop)
   * @param portCalls Array of port calls with updated sequence order
   * @returns Updated array of port calls with recalculated dates
   */
  static recalculateAfterSequenceChange(portCalls: VoyagePortCall[]): VoyagePortCall[] {
    return recalcAfterSequenceChange(portCalls);
  }

  /**
   * Validates port call sequence for business logic consistency
   * @param portCalls Array of port calls to validate
   * @returns Validation result with errors if any
   */
  static validatePortCallSequence(portCalls: VoyagePortCall[]): ValidationResult {
    return validatePortCallSequence(portCalls) as ValidationResult;
  }

  /**
   * Creates a new port call with default values
   * @param voyageId ID of the voyage
   * @param previousPort Previous port call for calculating defaults
   * @returns New port call with default values
   */
  static createDefaultPortCall(voyageId: number, previousPort?: VoyagePortCall): Omit<VoyagePortCall, 'id'> {
    return createDefaultPortCall(voyageId, previousPort);
  }

  // Helper methods

  /**
   * Calculates steam days based on distance and speed
   * @param distance Distance in nautical miles
   * @param speed Speed in knots
   * @returns Steam days
   */

  /**
   * Calculates port days between arrival and departure
   * @param arrival Arrival date
   * @param departure Departure date
   * @returns Port days
   */
  // Delegated utility functions are now provided by port-call-calculations.utils.ts
}
