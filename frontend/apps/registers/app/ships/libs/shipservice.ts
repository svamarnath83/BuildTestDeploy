import { Vessel, VesselGrade, addShip, createShipRequestSchema, updateShipRequestSchema } from '@commercialapp/ui';
import { showSuccessNotification, showErrorNotification } from '@commercialapp/ui';
import { SpeedConsumptionItem, validateAllTables, transformSpeedConsumptionsForSaving } from './index';

export interface ShipSubmissionData {
  shipData: Partial<Vessel>;
  gradeItems: VesselGrade[];
  speedConsumptions: SpeedConsumptionItem[];
  grades: Array<{ id: number; name: string }>;
  mode: 'add' | 'edit';
}

export interface ShipSubmissionResult {
  success: boolean;
  data?: Vessel;
  error?: string;
  fieldErrors?: { [key: string]: string };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors?: { [key: string]: string };
}

export class ShipService {
  /**
   * Validates the ship form data using Zod schema and custom table validation
   */
  static validateShipForm(
    shipData: Partial<Vessel>, 
    mode: 'add' | 'edit'
  ): ValidationResult {
    try {
      const schema = mode === 'edit' ? updateShipRequestSchema : createShipRequestSchema;
      const result = schema.safeParse(shipData);
      
      if (!result.success) {
        const errors = result.error.issues.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        const fieldErrors: { [key: string]: string } = {};
        result.error.issues.forEach(err => {
          const fieldPath = err.path.join('.');
          const topLevelField = fieldPath.split('.')[0];
          fieldErrors[topLevelField] = err.message;
        });
        return { isValid: false, errors, fieldErrors };
      }
      
      return { isValid: true, errors: [] };
    } catch (error) {
      return { 
        isValid: false, 
        errors: ['Validation failed due to unexpected error'] 
      };
    }
  }

  /**
   * Validates table data (grades and speed consumptions)
   */
  static validateTableData(
    gradeItems: VesselGrade[], 
    speedConsumptions: SpeedConsumptionItem[], 
    grades: Array<{ id: number; name: string }>
  ): ValidationResult {
    const tableErrors = validateAllTables(gradeItems, speedConsumptions, grades);
    
    if (tableErrors.length > 0) {
      const errors = tableErrors.map(err => err.message);
      return { isValid: false, errors };
    }
    
    return { isValid: true, errors: [] };
  }

  /**
   * Prepares the complete ship data for submission
   */
  static prepareShipDataForSubmission(
    shipData: Partial<Vessel>,
    gradeItems: VesselGrade[],
    speedConsumptions: SpeedConsumptionItem[]
  ): Vessel {
    // Transform speed consumptions using the transformer utility
    const transformedSpeedConsumptions = transformSpeedConsumptionsForSaving(speedConsumptions, gradeItems);

    // Combine all data into the ship object
    return {
      ...shipData,
      vesselGrades: gradeItems,
      vesselJson: JSON.stringify({
        speedConsumptions: transformedSpeedConsumptions
      })
    } as Vessel;
  }

  /**
   * Submits the ship data to the API
   */
  static async submitShip(data: ShipSubmissionData): Promise<ShipSubmissionResult> {
    try {
      // Validate form data first
      const formValidation = this.validateShipForm(data.shipData, data.mode);
      if (!formValidation.isValid) {
        return {
          success: false,
          error: `Form validation failed:\n${formValidation.errors.join('\n')}`,
          fieldErrors: formValidation.fieldErrors
        };
      }

      // Validate table data
      const tableValidation = this.validateTableData(
        data.gradeItems, 
        data.speedConsumptions, 
        data.grades
      );
      if (!tableValidation.isValid) {
        return {
          success: false,
          error: `Table validation failed:\n${tableValidation.errors.join('\n')}`
        };
      }

      // Prepare data for submission
      const completeShipData = this.prepareShipDataForSubmission(
        data.shipData,
        data.gradeItems,
        data.speedConsumptions
      );

      // Submit to API
      const response = await addShip(completeShipData);
      
      if (response && (response.status === 200 || response.status === 201 || response.data)) {
        return {
          success: true,
          data: completeShipData
        };
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error: any) {
      console.error('Error submitting ship:', error);
      return {
        success: false,
        error: error?.response?.data?.message || error?.message || "An unexpected error occurred. Please try again."
      };
    }
  }

  /**
   * Handles the complete form submission process including notifications
   */
  static async handleShipSubmission(data: ShipSubmissionData): Promise<ShipSubmissionResult> {
    const result = await this.submitShip(data);
    
    if (result.success) {
      // Show success notification
      showSuccessNotification({
        title: data.mode === 'edit' ? "Vessel Updated" : "Vessel Created",
        description: `Vessel "${data.shipData.name}" has been ${data.mode === 'edit' ? 'updated' : 'created'} successfully.`
      });
    } else {
      // Show error notification
      showErrorNotification({
        title: data.mode === 'edit' ? "Update Failed" : "Creation Failed",
        description: result.error || "An unexpected error occurred. Please try again."
      });
    }
    
    return result;
  }

  /**
   * Shows table validation errors in a user-friendly format
   */
  static showTableValidationErrors(errors: string[]): void {
    const errorDescription = `Please fill in the required fields:\n${errors.join('\n')}`;
    
    try {
      showErrorNotification({
        title: "Table Validation Error",
        description: errorDescription
      });
    } catch (error) {
      console.error('Failed to show error notification:', error);
    }
  }

  /**
   * Shows form validation errors in a user-friendly format
   */
  static showFormValidationErrors(errors: string[]): void {
    const errorDescription = `Please correct the following:\n${errors.join('\n')}`;
    
    try {
      showErrorNotification({
        title: "Form Validation Error",
        description: errorDescription
      });
    } catch (error) {
      console.error('Failed to show error notification:', error);
    }
  }
}
