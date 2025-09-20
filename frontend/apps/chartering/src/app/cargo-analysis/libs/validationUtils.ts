import { showErrorNotification, showWarningNotification } from '@commercialapp/ui';

/**
 * Validation utility functions for cargo analysis
 */

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Export the notification functions for use in other parts of the application
export { showErrorNotification, showWarningNotification };
