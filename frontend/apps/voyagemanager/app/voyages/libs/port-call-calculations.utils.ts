import type { VoyagePortCall } from './voyage-models';
import { parseISO, isValid as isValidDateFn, addDays, addHours, format, add } from 'date-fns';

/** ====================
 *   Date Utilities
 * ==================== */
function safeParseDate(date?: string | Date, fallback?: Date): Date {
  if (!date) return fallback ?? new Date();
  if (date instanceof Date) return isValidDateFn(date) ? date : fallback ?? new Date();
  const parsed = parseISO(date);
  return isValidDateFn(parsed) ? parsed : fallback ?? new Date();
}

function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days);
}

function addHoursToDate(date: Date, hours: number): Date {
  return addHours(date, hours);
}

/** ====================
 *   Steam & Port Calculations
 * ==================== */
function computeSteamDays(distance: number, speed: number): number {
  return speed > 0 ? distance / (speed * 24) : 0; // in days
}
function addSteamDaysToDate(startDate: Date, steamDays: number): Date {
  const totalMinutes = steamDays * 24 * 60; // convert days → minutes
  return add(startDate, { minutes: totalMinutes });
}
function computeDeparture(arrival: Date, portDays?: number): Date {
  const hours = portDays && portDays > 0 ? portDays * 24 : 1;
  return addHoursToDate(arrival, hours);
}

function calculateDaysDifference(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
}

function calculatePortDays(arrival: Date, departure: Date): number {
  return calculateDaysDifference(arrival, departure);
}

function getPortDaysFromPortCall(portCall: VoyagePortCall): number {
  return calculatePortDays(safeParseDate(portCall.arrival), safeParseDate(portCall.departure));
}

/** ====================
 *   Core Port Recalculation
 * ==================== */
function recalcPort(
  prevPort: VoyagePortCall | null,
  currentPort: VoyagePortCall,
  originalArrival?: Date
): VoyagePortCall {
  // Parse current port arrival
  let arrival = safeParseDate(currentPort.arrival, originalArrival);

  // Previous port departure
  const prevDeparture = prevPort?.departure ? safeParseDate(prevPort.departure) : null;

  // Compute speed and arrival based on previous port
  let speed = currentPort.speed ?? 12;
  if (prevDeparture) {
    const steamDays = computeSteamDays(currentPort.distance, speed);
    arrival = addSteamDaysToDate(prevDeparture, steamDays);
    // Recalculate speed in case arrival was manually changed
    speed = currentPort.distance / calculateDaysDifference(prevDeparture, arrival) / 24;
  }

  // Compute departure based on portDays
  const portDays = currentPort.portDays ?? 1;
  const departure = computeDeparture(arrival, portDays);

  // SteamDays for this port
  const steamDays = computeSteamDays(currentPort.distance, speed);

  return {
    ...currentPort,
    arrival: formatDate(arrival),
    departure: formatDate(departure),
    speed,
    steamDays,
  };
}

/** ====================
 *   Recalculate Following Ports
 * ==================== */
export function recalcFollowingPortsFrom(
  portCalls: VoyagePortCall[],
  changedIndex: number,
  specialFirstNext: boolean = false,
  portDaysFallback?: number
): VoyagePortCall[] {
  const updated = [...portCalls];
  for (let i = changedIndex + 1; i < updated.length; i++) {
    const prev = updated[i - 1];
    updated[i] = recalcPort(prev, updated[i]);
  }
  return updated;
}

/** ====================
 *   High-Level Recalculations
 * ==================== */
export function recalcAfterArrivalChange(
  portCalls: VoyagePortCall[],
  changedIndex: number,
  newArrival?: string
): VoyagePortCall[] {
  if (changedIndex < 0 || changedIndex >= portCalls.length) return portCalls;

  const updated = [...portCalls];
  const current = updated[changedIndex];
  const newArrivalDate = newArrival ? safeParseDate(newArrival) : safeParseDate(current.arrival);

  // Update previous port speed if exists
  if (changedIndex > 0) {
    const prev = updated[changedIndex - 1];
    const prevDeparture = safeParseDate(prev.departure);
    const distance = current.distance ?? 0;
    const newSpeed = distance / calculateDaysDifference(prevDeparture, newArrivalDate) / 24;
    prev.speed = newSpeed > 0 ? newSpeed : prev.speed;
  }

  // Update current port arrival and departure
  current.arrival = formatDate(newArrivalDate);
  const portDays = current.portDays ?? 1;
  current.departure = formatDate(computeDeparture(newArrivalDate, portDays));
  updated[changedIndex] = current;

  // Recalculate all following ports
  return recalcFollowingPortsFrom(updated, changedIndex);
}

export function recalcAfterPortDaysChange(portCalls: VoyagePortCall[], changedIndex: number): VoyagePortCall[] {
  if (changedIndex < 0 || changedIndex >= portCalls.length) return portCalls;
  const updated = [...portCalls];
  const current = updated[changedIndex];
  if (current.portDays === undefined || current.portDays < 0 || !current.arrival) return portCalls;

  const arrivalDate = safeParseDate(current.arrival);
  const newDeparture = computeDeparture(arrivalDate, current.portDays);
  updated[changedIndex] = { ...current, departure: formatDate(newDeparture) };
  return recalcFollowingPortsFrom(updated, changedIndex);
}

export function recalcAfterSpeedChange(portCalls: VoyagePortCall[], changedIndex: number): VoyagePortCall[] {
  if (changedIndex < 0 || changedIndex >= portCalls.length) return portCalls;
  const updated = [...portCalls];
  const current = updated[changedIndex];
  if (!current.speed || current.speed <= 0 || !current.arrival) return portCalls;

  const prev = changedIndex > 0 ? updated[changedIndex - 1] : null;
  const newArrival = prev?.departure
    ? newArrivalFromPreviousDeparture(prev.departure, current.distance, current.speed)
    : safeParseDate(current.arrival);

  updated[changedIndex] = {
    ...current,
    arrival: formatDate(newArrival),
    steamDays: computeSteamDays(current.distance, current.speed),
  };
  return recalcFollowingPortsFrom(updated, changedIndex, true);
}

export function recalcAfterDepartureChange(portCalls: VoyagePortCall[], changedIndex: number, originalDeparture?: string): VoyagePortCall[] {
  if (changedIndex < 0 || changedIndex >= portCalls.length) return portCalls;
  const updated = [...portCalls];
  const current = updated[changedIndex];

  const departureDate = safeParseDate(current.departure);
  const arrivalDate = safeParseDate(current.arrival);
  const newPortDays = Math.max(0, calculateDaysDifference(arrivalDate, departureDate));
  updated[changedIndex] = { ...current, portDays: newPortDays };

  const timeDifference = originalDeparture ? departureDate.getTime() - safeParseDate(originalDeparture).getTime() : 0;
  for (let i = changedIndex + 1; i < updated.length; i++) {
    const port = updated[i];
    const newArrival = new Date(safeParseDate(port.arrival).getTime() + timeDifference);
    const newDeparture = new Date(safeParseDate(port.departure).getTime() + timeDifference);
    updated[i] = { ...port, arrival: formatDate(newArrival), departure: formatDate(newDeparture) };
  }
  return updated;
}

export function recalcAfterDistanceChange(portCalls: VoyagePortCall[], changedIndex: number): VoyagePortCall[] {
  if (changedIndex < 0 || changedIndex >= portCalls.length) return portCalls;
  const updated = [...portCalls];
  const current = updated[changedIndex];

  if (!current.distance || current.distance < 0) return portCalls;

  const speed = current.speed ?? 12;
  const steamDays = computeSteamDays(current.distance, speed);
  const prev = changedIndex > 0 ? updated[changedIndex - 1] : null;
  const newArrival = prev?.departure
    ? newArrivalFromPreviousDeparture(prev.departure, current.distance, speed)
    : safeParseDate(current.arrival);

  updated[changedIndex] = { ...current, arrival: formatDate(newArrival), steamDays };
  return recalcFollowingPortsFrom(updated, changedIndex, false, 1);
}

/** ====================
 *   Sequence Change
 * ==================== */
export function recalcAfterSequenceChange(portCalls: VoyagePortCall[]): VoyagePortCall[] {
  const updated = [...portCalls].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  for (let i = 1; i < updated.length; i++) {
    const prev = updated[i - 1];
    const current = updated[i];
    const speed = current.speed ?? 12;
    const steamDays = computeSteamDays(current.distance, speed);
    const newArrival = newArrivalFromPreviousDeparture(prev.departure, current.distance, speed);
    const portDays = calculatePortDays(safeParseDate(current.arrival), safeParseDate(current.departure));
    const newDeparture = computeDeparture(newArrival, portDays);
    updated[i] = { ...current, arrival: formatDate(newArrival), departure: formatDate(newDeparture), steamDays };
  }
  return updated;
}

/** ====================
 *   Validation
 * ==================== */
export function validatePortCallSequence(portCalls: VoyagePortCall[]) {
  const errors: { field: string; message: string; portCallId: number }[] = [];
  const sorted = [...portCalls].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

  for (let i = 0; i < sorted.length; i++) {
    const port = sorted[i];
    const arrival = safeParseDate(port.arrival);
    const departure = safeParseDate(port.departure);

    if (departure <= arrival) errors.push({ field: 'departure', message: 'Departure must be after arrival', portCallId: port.id });
    if (i > 0 && arrival <= safeParseDate(sorted[i - 1].departure))
      errors.push({ field: 'arrival', message: 'Arrival must be after previous departure', portCallId: port.id });
    if (port.portDays !== undefined && port.portDays < 0) errors.push({ field: 'portDays', message: 'Port days must be positive', portCallId: port.id });
    if (port.speed !== undefined && (port.speed <= 0 || port.speed > 50)) errors.push({ field: 'speed', message: 'Speed must be 0-50 knots', portCallId: port.id });
    if (port.distance !== undefined && port.distance < 0) errors.push({ field: 'distance', message: 'Distance must be positive', portCallId: port.id });
  }

  return { isValid: errors.length === 0, errors };
}

/** ====================
 *   Default Port Call
 * ==================== */
export function createDefaultPortCall(voyageId: number, previousPort?: VoyagePortCall): Omit<VoyagePortCall, 'id'> {
  const now = new Date();
  const defaultSpeed = previousPort?.speed ?? 12;
  const defaultDistance = previousPort?.distance ?? 100;
  const defaultPortDays = 1;

  let arrival = now;
  let departure = addDaysToDate(now, defaultPortDays);
  let steamDays = 0;

  if (previousPort?.departure) {
    steamDays = computeSteamDays(defaultDistance, defaultSpeed);
    arrival = addHoursToDate(safeParseDate(previousPort.departure), steamDays * 24);
    departure = addDaysToDate(arrival, defaultPortDays);
  }

  return {
    voyageId,
    portId: 0,
    portName: '',
    sequenceOrder: previousPort ? previousPort.sequenceOrder + 1 : 1,
    activity: 'Load',
    arrival: formatDate(arrival),
    departure: formatDate(departure),
    distance: defaultDistance,
    portDays: defaultPortDays,
    speed: defaultSpeed,
    portCost: 0,
    cargoCost: 0,
    steamDays
  };
}

/** ====================
 *   Arrival Helper
 * ==================== */
export function newArrivalFromPreviousDeparture(previousDeparture: string | Date, distance: number, speed: number): Date {
  const prev = safeParseDate(previousDeparture);
  const steamDays = computeSteamDays(distance, speed);
  return addHoursToDate(prev, steamDays * 24);
}
