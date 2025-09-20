import { 
  validateVesselGrades, 
  validateSpeedConsumptions, 
  validateAllTables 
} from '../validation';
import { SpeedConsumptionItem } from '../types';

describe('Ship Validation CRUD Operations', () => {
  describe('validateVesselGrades', () => {
    it('should pass validation with valid grades', () => {
      const validGrades = [
        {
          id: 1,
          vesselId: 1,
          gradeId: 1,
          uomId: 1,
          sortOrder: 1,
          type: 'primary',
          gradeName: 'Test Grade'
        }
      ];

      const errors = validateVesselGrades(validGrades);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when no grades provided', () => {
      const errors = validateVesselGrades([]);
      
      expect(errors).toHaveLength(1);
      expect(errors[0]).toEqual({
        field: 'grades',
        message: 'At least one vessel grade is required'
      });
    });

    it('should fail validation when grades array is null or undefined', () => {
      const errorsNull = validateVesselGrades(null as any);
      const errorsUndefined = validateVesselGrades(undefined as any);
      
      expect(errorsNull).toHaveLength(1);
      expect(errorsUndefined).toHaveLength(1);
      expect(errorsNull[0].message).toContain('At least one vessel grade is required');
    });

    it('should fail validation when no valid grades exist', () => {
      const invalidGrades = [
        {
          id: 1,
          vesselId: 1,
          gradeId: 0, // Invalid
          uomId: 0,   // Invalid
          sortOrder: 1,
          type: 'primary',
          gradeName: ''
        }
      ];

      const errors = validateVesselGrades(invalidGrades);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.message.includes('valid grade selection'))).toBe(true);
    });

    it('should fail validation for individual grade fields', () => {
      const gradesWithMissingFields = [
        {
          id: 1,
          vesselId: 1,
          gradeId: 0, // Missing grade selection
          uomId: 1,
          sortOrder: 1,
          type: 'primary',
          gradeName: 'Test Grade'
        },
        {
          id: 2,
          vesselId: 1,
          gradeId: 1,
          uomId: 0, // Missing UOM selection
          sortOrder: 2,
          type: 'secondary',
          gradeName: 'Test Grade 2'
        }
      ];

      const errors = validateVesselGrades(gradesWithMissingFields);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.message.includes('Grade 1: Grade selection is required'))).toBe(true);
      expect(errors.some(error => error.message.includes('Grade 2: UOM selection is required'))).toBe(true);
    });

    it('should handle null and undefined grade values', () => {
      const gradesWithNullValues = [
        {
          id: 1,
          vesselId: 1,
          gradeId: null,
          uomId: undefined,
          sortOrder: 1,
          type: 'primary',
          gradeName: 'Test Grade'
        }
      ];

      const errors = validateVesselGrades(gradesWithNullValues);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.message.includes('Grade selection is required'))).toBe(true);
      expect(errors.some(error => error.message.includes('UOM selection is required'))).toBe(true);
    });
  });

  describe('validateSpeedConsumptions', () => {
    const mockGradeItems = [
      {
        id: 1,
        vesselId: 1,
        gradeId: 1,
        uomId: 1,
        sortOrder: 1,
        type: 'primary',
        gradeName: 'Test Grade'
      }
    ];

    const mockGrades = [
      { id: 1, name: 'Test Grade' }
    ];

    it('should pass validation with valid speed consumptions', () => {
      const validSpeedConsumptions: SpeedConsumptionItem[] = [
        {
          id: 1,
          speed: '',
          mode: 'port',
          consumptions: {} // Port row is always incomplete by design
        },
        {
          id: 2,
          speed: '12',
          mode: 'ballast',
          consumptions: { 1: 25 }
        },
        {
          id: 3,
          speed: '14',
          mode: 'laden',
          consumptions: { 1: 30 }
        }
      ];

      const errors = validateSpeedConsumptions(validSpeedConsumptions, mockGradeItems, mockGrades);
      expect(errors).toHaveLength(0);
    });

    it('should skip validation for port row (id === 1)', () => {
      const speedConsumptionsWithIncompletePort: SpeedConsumptionItem[] = [
        {
          id: 1,
          speed: '', // Empty speed should be ignored for port
          mode: 'port',
          consumptions: {} // Empty consumptions should be ignored for port
        },
        {
          id: 2,
          speed: '12',
          mode: 'ballast',
          consumptions: { 1: 25 }
        },
        {
          id: 3,
          speed: '14',
          mode: 'laden',
          consumptions: { 1: 30 }
        }
      ];

      const errors = validateSpeedConsumptions(speedConsumptionsWithIncompletePort, mockGradeItems, mockGrades);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when speed is missing or zero', () => {
      const speedConsumptionsWithInvalidSpeed: SpeedConsumptionItem[] = [
        {
          id: 2,
          speed: '', // Empty speed
          mode: 'ballast',
          consumptions: { 1: 25 }
        },
        {
          id: 3,
          speed: '0', // Zero speed
          mode: 'laden',
          consumptions: { 1: 30 }
        }
      ];

      const errors = validateSpeedConsumptions(speedConsumptionsWithInvalidSpeed, mockGradeItems, mockGrades);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.message.includes('Speed value is required'))).toBe(true);
    });

    it('should fail validation when consumption values are missing', () => {
      const speedConsumptionsWithMissingConsumptions: SpeedConsumptionItem[] = [
        {
          id: 2,
          speed: '12',
          mode: 'ballast',
          consumptions: {} // Missing consumption
        },
        {
          id: 3,
          speed: '14',
          mode: 'laden',
          consumptions: { 1: 0 } // Zero consumption
        }
      ];

      const errors = validateSpeedConsumptions(speedConsumptionsWithMissingConsumptions, mockGradeItems, mockGrades);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.message.includes('Consumption value for Test Grade is required'))).toBe(true);
    });

    it('should fail validation when consumption values are negative', () => {
      const speedConsumptionsWithNegativeConsumptions: SpeedConsumptionItem[] = [
        {
          id: 2,
          speed: '12',
          mode: 'ballast',
          consumptions: { 1: -5 } // Negative consumption
        }
      ];

      const errors = validateSpeedConsumptions(speedConsumptionsWithNegativeConsumptions, mockGradeItems, mockGrades);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.message.includes('must be a positive number'))).toBe(true);
    });

    it('should require at least one valid ballast record', () => {
      const speedConsumptionsWithoutBallast: SpeedConsumptionItem[] = [
        {
          id: 1,
          speed: '',
          mode: 'port',
          consumptions: {}
        },
        {
          id: 3,
          speed: '14',
          mode: 'laden',
          consumptions: { 1: 30 }
        }
        // No ballast record
      ];

      const errors = validateSpeedConsumptions(speedConsumptionsWithoutBallast, mockGradeItems, mockGrades);
      
      expect(errors.some(error => error.message.includes('ballast record'))).toBe(true);
    });

    it('should require at least one valid laden record', () => {
      const speedConsumptionsWithoutLaden: SpeedConsumptionItem[] = [
        {
          id: 1,
          speed: '',
          mode: 'port',
          consumptions: {}
        },
        {
          id: 2,
          speed: '12',
          mode: 'ballast',
          consumptions: { 1: 25 }
        }
        // No laden record
      ];

      const errors = validateSpeedConsumptions(speedConsumptionsWithoutLaden, mockGradeItems, mockGrades);
      
      expect(errors.some(error => error.message.includes('laden record'))).toBe(true);
    });

    it('should handle multiple grades in consumption validation', () => {
      const multipleGradeItems = [
        ...mockGradeItems,
        {
          id: 2,
          vesselId: 1,
          gradeId: 2,
          uomId: 2,
          sortOrder: 2,
          type: 'secondary',
          gradeName: 'Test Grade 2'
        }
      ];

      const multipleGrades = [
        ...mockGrades,
        { id: 2, name: 'Test Grade 2' }
      ];

      const speedConsumptionsWithMultipleGrades: SpeedConsumptionItem[] = [
        {
          id: 2,
          speed: '12',
          mode: 'ballast',
          consumptions: { 1: 25 } // Missing consumption for grade 2
        },
        {
          id: 3,
          speed: '14',
          mode: 'laden',
          consumptions: { 1: 30, 2: 35 } // Complete consumptions
        }
      ];

      const errors = validateSpeedConsumptions(speedConsumptionsWithMultipleGrades, multipleGradeItems, multipleGrades);
      
      expect(errors.some(error => error.message.includes('Test Grade 2 is required'))).toBe(true);
    });
  });

  describe('validateAllTables', () => {
    const mockGradeItems = [
      {
        id: 1,
        vesselId: 1,
        gradeId: 1,
        uomId: 1,
        sortOrder: 1,
        type: 'primary',
        gradeName: 'Test Grade'
      }
    ];

    const mockSpeedConsumptions: SpeedConsumptionItem[] = [
      {
        id: 1,
        speed: '',
        mode: 'port',
        consumptions: {}
      },
      {
        id: 2,
        speed: '12',
        mode: 'ballast',
        consumptions: { 1: 25 }
      },
      {
        id: 3,
        speed: '14',
        mode: 'laden',
        consumptions: { 1: 30 }
      }
    ];

    const mockGrades = [
      { id: 1, name: 'Test Grade' }
    ];

    it('should pass validation when all tables are valid', () => {
      const errors = validateAllTables(mockGradeItems, mockSpeedConsumptions, mockGrades);
      expect(errors).toHaveLength(0);
    });

    it('should combine errors from both grade and speed consumption validation', () => {
      const invalidGradeItems = []; // No grades
      const invalidSpeedConsumptions: SpeedConsumptionItem[] = [
        {
          id: 2,
          speed: '', // Invalid speed
          mode: 'ballast',
          consumptions: {}
        }
      ];

      const errors = validateAllTables(invalidGradeItems, invalidSpeedConsumptions, mockGrades);
      
      expect(errors.length).toBeGreaterThan(0);
      // Should have errors from both grade and speed validation
      expect(errors.some(error => error.message.includes('vessel grade is required'))).toBe(true);
      expect(errors.some(error => error.message.includes('ballast record'))).toBe(true);
    });

    it('should return all validation errors in a single array', () => {
      const invalidGradeItems = [
        {
          id: 1,
          vesselId: 1,
          gradeId: 0, // Invalid
          uomId: 0,   // Invalid
          sortOrder: 1,
          type: 'primary',
          gradeName: ''
        }
      ];

      const invalidSpeedConsumptions: SpeedConsumptionItem[] = [
        {
          id: 2,
          speed: '0', // Invalid
          mode: 'ballast',
          consumptions: { 1: -5 } // Invalid
        }
      ];

      const errors = validateAllTables(invalidGradeItems, invalidSpeedConsumptions, mockGrades);
      
      expect(errors.length).toBeGreaterThan(2);
      expect(Array.isArray(errors)).toBe(true);
      
      // Should contain errors from both validation functions
      const gradeErrors = errors.filter(error => error.field.includes('grade'));
      const speedErrors = errors.filter(error => error.field.includes('speed') || error.field.includes('consumption'));
      
      expect(gradeErrors.length).toBeGreaterThan(0);
      expect(speedErrors.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty arrays gracefully', () => {
      const errors = validateAllTables([], [], []);
      
      expect(Array.isArray(errors)).toBe(true);
      expect(errors.length).toBeGreaterThan(0); // Should have validation errors for empty data
    });

    it('should handle speed consumptions with undefined consumptions object', () => {
      const speedConsumptionsWithUndefinedConsumptions: SpeedConsumptionItem[] = [
        {
          id: 2,
          speed: '12',
          mode: 'ballast',
          consumptions: undefined as any
        }
      ];

      const mockGradeItems = [
        {
          id: 1,
          vesselId: 1,
          gradeId: 1,
          uomId: 1,
          sortOrder: 1,
          type: 'primary',
          gradeName: 'Test Grade'
        }
      ];

      const errors = validateSpeedConsumptions(
        speedConsumptionsWithUndefinedConsumptions, 
        mockGradeItems, 
        [{ id: 1, name: 'Test Grade' }]
      );
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(error => error.message.includes('Consumption value'))).toBe(true);
    });

    it('should handle grade items with zero or missing gradeId', () => {
      const gradeItemsWithInvalidIds = [
        {
          id: 1,
          vesselId: 1,
          gradeId: 0,
          uomId: 1,
          sortOrder: 1,
          type: 'primary',
          gradeName: 'Test Grade'
        }
      ];

      const speedConsumptions: SpeedConsumptionItem[] = [
        {
          id: 2,
          speed: '12',
          mode: 'ballast',
          consumptions: { 0: 25 } // Consumption for invalid grade
        }
      ];

      const errors = validateSpeedConsumptions(speedConsumptions, gradeItemsWithInvalidIds, []);
      
      // Should not validate consumptions for invalid grade IDs
      expect(Array.isArray(errors)).toBe(true);
    });
  });
});
