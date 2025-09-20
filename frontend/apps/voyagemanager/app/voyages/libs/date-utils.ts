/**
 * Date utility functions for port call management using date-fns
 */

import { 
  format, 
  parseISO, 
  isValid, 
  addDays, 
  addHours, 
  differenceInDays, 
  isSameDay, 
  startOfDay, 
  endOfDay,
  formatISO
} from 'date-fns';

/**
 * Converts a date string or Date object to HTML datetime-local input format
 * @param value - Date string or Date object
 * @returns Formatted date string for datetime-local input
 */
export function toInputDateTime(value?: string | Date): string {
  if (!value) return '';
  
  try {
    const date = typeof value === 'string' ? parseISO(value) : value;
    if (!isValid(date)) return '';
    
    // Format: YYYY-MM-DDTHH:mm
    return format(date, 'yyyy-MM-dd\'T\'HH:mm');
  } catch (error) {
    console.warn('Invalid date value:', value, error);
    return '';
  }
}

/**
 * Converts HTML datetime-local input value to ISO string
 * @param value - HTML datetime-local input value
 * @returns ISO date string
 */
export function fromInputDateTime(value: string): string {
  if (!value) return '';
  
  try {
    const date = parseISO(value);
    return isValid(date) ? formatISO(date) : '';
  } catch (error) {
    console.warn('Invalid datetime input:', value, error);
    return '';
  }
}

/**
 * Formats a date for display
 * @param value - Date string or Date object
 * @param formatString - Display format (default: 'yyyy-MM-dd HH:mm')
 * @returns Formatted date string
 */
export function formatDisplayDate(value?: string | Date, formatString: string = 'yyyy-MM-dd HH:mm'): string {
  if (!value) return '';
  
  try {
    const date = typeof value === 'string' ? parseISO(value) : value;
    if (!isValid(date)) return '';
    
    return format(date, formatString);
  } catch (error) {
    console.warn('Invalid date for formatting:', value, error);
    return '';
  }
}

/**
 * Validates if a date string is valid
 * @param value - Date string
 * @returns True if valid date
 */
export function isValidDate(value: string): boolean {
  if (!value) return false;
  
  try {
    const date = parseISO(value);
    return isValid(date);
  } catch (error) {
    return false;
  }
}

/**
 * Gets the current date in input format
 * @returns Current date in datetime-local format
 */
export function getCurrentDateTime(): string {
  return toInputDateTime(new Date());
}

/**
 * Adds days to a date
 * @param date - Date to add days to
 * @param days - Number of days to add
 * @returns New date with days added
 */
export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days);
}

/**
 * Adds hours to a date
 * @param date - Date to add hours to
 * @param hours - Number of hours to add
 * @returns New date with hours added
 */
export function addHoursToDate(date: Date, hours: number): Date {
  return addHours(date, hours);
}

/**
 * Calculates the difference between two dates in days
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Difference in days
 */
export function calculateDaysDifference(date1: Date, date2: Date): number {
  return differenceInDays(date2, date1);
}

/**
 * Checks if two dates are the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if same day
 */
export function isSameDayDate(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

/**
 * Gets the start of day for a date
 * @param date - Date to get start of day for
 * @returns Start of day date
 */
export function getStartOfDay(date: Date): Date {
  return startOfDay(date);
}

/**
 * Gets the end of day for a date
 * @param date - Date to get end of day for
 * @returns End of day date
 */
export function getEndOfDay(date: Date): Date {
  return endOfDay(date);
}

/**
 * Parses a date string or Date object to Date object
 * @param dateInput - Date string or Date object to parse
 * @returns Date object or current date if invalid
 */
export function parseDate(dateInput: string | Date): Date {
  if (!dateInput) {
    return new Date();
  }
  
  if (dateInput instanceof Date) {
    return isValid(dateInput) ? dateInput : new Date();
  }
  
  try {
    const date = parseISO(dateInput);
    return isValid(date) ? date : new Date(dateInput);
  } catch (error) {
    console.warn('Invalid date input:', dateInput, error);
    return new Date();
  }
}

/**
 * Formats a date to ISO string (UTC format)
 * @param date - Date to format
 * @returns ISO string in UTC format
 */
export function formatDate(date: Date): string {
  try {
    if (!isValid(date)) return '';
    // Return UTC format to match expected test format
    return date.toISOString();
  } catch (error) {
    console.warn('Invalid date for formatting:', date, error);
    return '';
  }
}