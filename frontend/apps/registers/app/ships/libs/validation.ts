import { SpeedConsumptionItem, TableValidationError } from './types';

export const validateVesselGrades = (gradeItems: any[]): TableValidationError[] => {
  const errors: TableValidationError[] = [];
  
  // Validate that at least one vessel grade exists
  if (!gradeItems || gradeItems.length === 0) {
    errors.push({ field: 'grades', message: 'At least one vessel grade is required' });
    return errors;
  }
  
  // Check if at least one grade has valid data (not just empty grades)
  const hasValidGrade = gradeItems.some(grade => 
    grade.gradeId > 0 && grade.uomId > 0
  );
  
  if (!hasValidGrade) {
    errors.push({ field: 'grades', message: 'At least one vessel grade must have a valid grade selection and unit of measure' });
  }
  
  // Validate each grade row
  gradeItems.forEach((grade, index) => {
    if (grade.gradeId === 0 || grade.gradeId === null || grade.gradeId === undefined) {
      errors.push({ field: `grade_${index + 1}`, message: `Grade ${index + 1}: Grade selection is required` });
    }
    if (grade.uomId === 0 || grade.uomId === null || grade.uomId === undefined) {
      errors.push({ field: `grade_${index + 1}`, message: `Grade ${index + 1}: UOM selection is required` });
    }
  });
  
  return errors;
};

export const validateSpeedConsumptions = (
  speedConsumptions: SpeedConsumptionItem[], 
  gradeItems: any[], 
  grades: Array<{ id: number; name: string }>
): TableValidationError[] => {
  const errors: TableValidationError[] = [];
  
  // Validate each speed consumption row
  speedConsumptions.forEach((item, index) => {
    // Skip validation for port row (id === 1) as it's always incomplete by design
    if (item.id === 1) return;
    
    // For non-port rows, validate speed and consumption
    if (!item.speed || item.speed.trim() === '' || item.speed === '0' || item.speed === '0.0') {
      errors.push({ field: `speed_${index + 1}`, message: `Speed ${index + 1}: Speed value is required (cannot be zero)` });
    }
    
    // Validate that ALL grades have consumption values
    const consumptions = item.consumptions || {};
    
    // Check if there are any grades defined in the system
    if (gradeItems.length > 0) {
      // For each grade that exists in the system, check if consumption is provided
      gradeItems.forEach((grade) => {
        const gradeId = grade.gradeId;
        if (gradeId && gradeId !== 0) {
          const consumption = consumptions[gradeId];
          
          // Get grade name from the grades data
          const gradeData = grades.find(g => g.id === gradeId);
          const gradeName = gradeData ? gradeData.name : `Grade ${gradeId}`;
          
          if (!consumption || consumption === 0) {
            errors.push({ field: `consumption_${index + 1}_${gradeId}`, message: `Speed ${index + 1}: Consumption value for ${gradeName} is required` });
          } else {
            // Validate that the consumption is a positive number
            if (consumption <= 0) {
              errors.push({ field: `consumption_${index + 1}_${gradeId}`, message: `Speed ${index + 1}: Consumption value for ${gradeName} must be a positive number` });
            }
          }
        }
      });
    }
  });
  
  // Validate that at least one ballast and one laden record exists with valid data
  const ballastRecords = speedConsumptions.filter(item => item.mode === 'ballast' && item.id !== 1);
  const ladenRecords = speedConsumptions.filter(item => item.mode === 'laden' && item.id !== 1);
  
  const hasValidBallast = ballastRecords.some(item => 
    item.speed && item.speed.trim() !== '' && 
    Object.values(item.consumptions || {}).some(consumption => consumption > 0)
  );
  
  const hasValidLaden = ladenRecords.some(item => 
    item.speed && item.speed.trim() !== '' && 
    Object.values(item.consumptions || {}).some(consumption => consumption > 0)
  );
  
  if (!hasValidBallast) {
    errors.push({ field: 'ballast', message: 'At least one ballast record with valid speed and consumption data is required' });
  }
  
  if (!hasValidLaden) {
    errors.push({ field: 'laden', message: 'At least one laden record with valid speed and consumption data is required' });
  }
  
  return errors;
};

export const validateAllTables = (
  gradeItems: any[], 
  speedConsumptions: SpeedConsumptionItem[], 
  grades: Array<{ id: number; name: string }>
): TableValidationError[] => {
  const gradeErrors = validateVesselGrades(gradeItems);
  const speedErrors = validateSpeedConsumptions(speedConsumptions, gradeItems, grades);
  
  return [...gradeErrors, ...speedErrors];
};
