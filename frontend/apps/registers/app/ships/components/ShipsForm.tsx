import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Vessel, VesselGrade, addShip, createShipRequestSchema, updateShipRequestSchema, getGrade } from '@commercialapp/ui';
import {
  pageWrapper,
  sectionContainer,
  topBar,
  buttonBack,
  buttonSave,
  heading,
  Button,
} from '@commercialapp/ui';
import { ArrowLeft } from 'lucide-react';
import { 
  showSuccessNotification, 
  showErrorNotification 
} from '@commercialapp/ui';
import ShipGeneralInfo from './ShipGeneralInfo';
import ShipGrades from './ShipGrades';
import ShipSpeedConsumption from './ShipSpeedConsumption';

interface SpeedConsumptionItem {
  id: number;
  speed: string;
  mode: 'ballast' | 'laden' | 'port';
  consumptions: { [gradeId: number]: number };
  isDefault?: boolean; // Add default flag
}

interface ShipsFormProps {
  initialData?: Partial<Vessel>;
  onSubmit: (data: Vessel) => void;
  onCancel: () => void;
  mode?: 'add' | 'edit';
}

export default function ShipsForm({ initialData = {}, onSubmit, onCancel, mode = 'add' }: ShipsFormProps) {

  const [shipData, setShipData] = useState<Partial<Vessel>>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [gradeItems, setGradeItems] = useState<VesselGrade[]>(() => {
    // Initialize with grades from initialData if available
    let vesselGrades = (initialData as any)?.vesselGrades || (initialData as any)?.VesselGrades || [];
    
    // If vesselGrades is a JSON string, parse it
    if (typeof vesselGrades === 'string') {
      try {
        vesselGrades = JSON.parse(vesselGrades);
      } catch (e) {
        console.error('Failed to parse vesselGrades JSON:', e);
        vesselGrades = [];
      }
    }
    
    if (Array.isArray(vesselGrades) && vesselGrades.length > 0) {
      return vesselGrades.map((g: any) => ({
        id: Number(g?.id) || 0,
        vesselId: Number(g?.vesselId ?? (initialData as any)?.id) || 0,
        gradeId: Number(g?.gradeId ?? g?.GradeId) || 0,
        uomId: Number(g?.uomId ?? g?.UomId ?? 0),
        sortOrder: Number(g?.sortOrder ?? g?.SortOrder ?? 0),
        type: String(g?.type ?? g?.Type ?? 'primary'),
        gradeName: String(g?.gradeName ?? g?.GradeName ?? ''),
      }));
    }
    
    // If no grades exist, create a default empty grade to ensure at least one exists
    return [{
      id: 1,
      vesselId: Number((initialData as any)?.id) || 0,
      gradeId: 0,
      uomId: 0,
      sortOrder: 1,
      type: 'primary',
      gradeName: '',
    }];
  });
  const [speedConsumptions, setSpeedConsumptions] = useState<SpeedConsumptionItem[]>([
    {
      id: 1,
      speed: '',
      mode: 'port',
      consumptions: {}
    },
    {
      id: 2,
      speed: '',
      mode: 'ballast',
      consumptions: {},
      isDefault: true
    },
    {
      id: 3,
      speed: '',
      mode: 'laden',
      consumptions: {},
      isDefault: true
    }
  ]);
  const [grades, setGrades] = useState<Array<{ id: number; name: string }>>([]);

  // Field-level validation function
  const validateField = (name: string, value: any) => {
    try {
      const schema = mode === 'edit' ? updateShipRequestSchema : createShipRequestSchema;
      const fieldSchema = schema.shape[name as keyof typeof schema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => {
          const { [name]: removed, ...rest } = prev;
          return rest;
        });
      }
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [name]: err.errors?.[0]?.message || 'Invalid input' }));
    }
  };

  // Helper function to get the expected type for a field
  const getFieldType = (fieldName: string): 'string' | 'number' | 'boolean' => {
    const fieldTypes: Record<string, 'string' | 'number' | 'boolean'> = {
      name: 'string',
      code: 'string',
      imo: 'string',
      type: 'string',
      dwt: 'string',
      runningCost: 'string'
    };
    
    return fieldTypes[fieldName] || 'string';
  };

  // Load grades data
  useEffect(() => {
    const loadGrades = async () => {
      try {
        const response = await getGrade();
        setGrades(response.data);
      } catch (error) {
        console.error('Failed to load grades:', error);
      }
    };
    loadGrades();
  }, []);

  // Populate grade names when grades data is loaded
  useEffect(() => {
    if (grades.length > 0 && gradeItems.length > 0) {
      const updatedGradeItems = gradeItems.map(grade => {
        if (grade.gradeId > 0) {
          const gradeData = grades.find(g => g.id === grade.gradeId);
          return {
            ...grade,
            gradeName: gradeData?.name || ''
          };
        }
        return grade;
      });
      setGradeItems(updatedGradeItems);
    }
  }, [grades, gradeItems.length]);

  // Only run this effect once on mount to handle initial data
  useEffect(() => {

    
    // Merge basic ship fields
    setShipData(prev => ({ ...prev, ...initialData }));

    // 1) Ship grades (normalize types for UI)
    let vesselGrades = (initialData as any)?.vesselGrades || (initialData as any)?.VesselGrades || [];
    
    // If vesselGrades is a JSON string, parse it
    if (typeof vesselGrades === 'string') {
      try {
        vesselGrades = JSON.parse(vesselGrades);
      } catch (e) {
        console.error('Failed to parse vesselGrades JSON:', e);
        vesselGrades = [];
      }
    }
    

    if (Array.isArray(vesselGrades)) {
      const mappedGrades: VesselGrade[] = vesselGrades.map((g: any) => ({
        id: Number(g?.id) || 0,
        vesselId: Number(g?.vesselId ?? (initialData as any)?.id) || 0,
        gradeId: Number(g?.gradeId ?? g?.GradeId) || 0,
        uomId: Number(g?.uomId ?? g?.UomId ?? 0),
        sortOrder: Number(g?.sortOrder ?? g?.SortOrder ?? 0),
        type: String(g?.type ?? g?.Type ?? 'primary'),
        gradeName: String(g?.gradeName ?? g?.GradeName ?? ''),
      }));
      
      // Ensure at least one grade exists
      if (mappedGrades.length > 0) {
        setGradeItems(mappedGrades);
      } else {
        // Create a default empty grade if none exist
        setGradeItems([{
          id: 1,
          vesselId: Number((initialData as any)?.id) || 0,
          gradeId: 0,
          uomId: 0,
          sortOrder: 1,
          type: 'primary',
          gradeName: '',
        }]);
      }
    } else {
      // If no grades exist, create a default empty grade
      setGradeItems([{
        id: 1,
        vesselId: Number((initialData as any)?.id) || 0,
        gradeId: 0,
        uomId: 0,
        sortOrder: 1,
        type: 'primary',
        gradeName: '',
      }]);
    }

    // 2) Speed & consumption (from shipJson)
    let rawShipJson = (initialData as any)?.vesselJson;
    
    if (rawShipJson) {
      try {
        const parsed = typeof rawShipJson === 'string' ? JSON.parse(rawShipJson) : rawShipJson;
        const sc = parsed?.speedConsumptions;
        if (Array.isArray(sc)) {
          const grouped = new Map<string, SpeedConsumptionItem>();
          sc.forEach((row: any) => {
            const idNum = Number(row?.id) || 0;
            const speedStr = String(row?.speed ?? '');
            const modeStr = (row?.mode as 'ballast' | 'laden' | 'port') ?? 'ballast';
            const isDefault = Boolean(row?.isDefault) || false; // Parse isDefault property
            const key = `${idNum}|${speedStr}|${modeStr}`;
            if (!grouped.has(key)) {
              grouped.set(key, {
                id: idNum,
                speed: speedStr,
                mode: modeStr,
                consumptions: {},
                isDefault: isDefault, // Set isDefault property
              });
            }
            const entry = grouped.get(key)!;
            const gid = Number(row?.gradeId) || 0;
            if (gid) {
              entry.consumptions[gid] = Number(row?.consumption ?? 0);
            }
          });

          let list = Array.from(grouped.values());
          // Ensure the default port row exists
          if (!list.some(item => item.id === 1 && item.mode === 'port')) {
            list = [{ id: 1, speed: '', mode: 'port', consumptions: {} }, ...list];
          }
          
          // Ensure at least one ballast and one laden record exists with proper defaults
          if (!list.some(item => item.mode === 'ballast')) {
            list.push({ id: Math.max(...list.map(item => item.id), 0) + 1, speed: '', mode: 'ballast', consumptions: {}, isDefault: true });
          } else {
            // If ballast records exist but none are default, make the first one default
            const ballastRecords = list.filter(item => item.mode === 'ballast');
            if (ballastRecords.length > 0 && !ballastRecords.some(item => item.isDefault)) {
              list = list.map(item => 
                item.id === ballastRecords[0].id ? { ...item, isDefault: true } : item
              );
            }
          }
          
          if (!list.some(item => item.mode === 'laden')) {
            list.push({ id: Math.max(...list.map(item => item.id), 0) + 1, speed: '', mode: 'laden', consumptions: {}, isDefault: true });
          } else {
            // If laden records exist but none are default, make the first one default
            const ladenRecords = list.filter(item => item.mode === 'laden');
            if (ladenRecords.length > 0 && !ladenRecords.some(item => item.isDefault)) {
              list = list.map(item => 
                item.id === ladenRecords[0].id ? { ...item, isDefault: true } : item
              );
            }
          }
          
          setSpeedConsumptions(list);
        }
      } catch (e) {
        console.error('Failed to parse shipJson for speedConsumptions:', e);
      }
    }
  }, []); // Empty dependency array - only run once on mount

  const handleGeneralInfoChange = (data: Partial<Vessel>) => {
    setShipData(data);
  };

  const handleGradesChange = (grades: VesselGrade[]) => {
    setGradeItems(grades);
  };

  const handleSpeedConsumptionChange = (speedConsumptions: SpeedConsumptionItem[]) => {
    setSpeedConsumptions(speedConsumptions);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    // Validate with zod before submission
    const schema = mode === 'edit' ? updateShipRequestSchema : createShipRequestSchema;
    const result = schema.safeParse(shipData);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((err) => {
        if (typeof err.path[0] === 'string') fieldErrors[err.path[0]] = err.message;
      });
  
      setErrors(fieldErrors);
      
      // Check if we have table-related errors (grade or speed consumption) for alert dialog
      const tableErrors = Object.entries(fieldErrors).filter(([field]) => 
        field.includes('grade') || field.includes('speed') || field.includes('consumption') || 
        field.includes('vesselGrades') || field.includes('vesselJson')
      );
      
      if (tableErrors.length > 0) {
        // Show alert dialog for table-related errors
        const errorDetails = tableErrors
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n');
        
        showErrorNotification({
          title: "Table Validation Error",
          description: `Please correct the following table errors:\n${errorDetails}`
        });
      }
      return;
    }
    

    // Check table data since it's not in the Zod schema
    const tableErrors: string[] = [];
    
    // Validate that at least one vessel grade exists
    if (!gradeItems || gradeItems.length === 0) {
      tableErrors.push('At least one vessel grade is required');
    } else {
      // Check if at least one grade has valid data (not just empty grades)
      const hasValidGrade = gradeItems.some(grade => 
        grade.gradeId > 0 && grade.uomId > 0
      );
      
      if (!hasValidGrade) {
        tableErrors.push('At least one vessel grade must have a valid grade selection and unit of measure');
      }
    }
    
    // Validate each grade row
    gradeItems.forEach((grade, index) => {
      if (grade.gradeId === 0 || grade.gradeId === null || grade.gradeId === undefined) {
        const errorMsg = `Grade ${index + 1}: Grade selection is required`;
        tableErrors.push(errorMsg);
      }
      if (grade.uomId === 0 || grade.uomId === null || grade.uomId === undefined) {
        const errorMsg = `Grade ${index + 1}: UOM selection is required`;
        tableErrors.push(errorMsg);
      }
    });
    
    // Validate each speed consumption row
    speedConsumptions.forEach((item, index) => {
      // Skip validation for port row (id === 1) as it's always incomplete by design
     
      
      // For non-port rows, validate speed and consumption
      if (item.id !== 1 && (!item.speed || item.speed.trim() === '' || item.speed === '0' || item.speed === '0.0')) {
        const errorMsg = `Speed ${index + 1}: Speed value is required (cannot be zero)`;
        tableErrors.push(errorMsg);
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
              const errorMsg = `Speed ${index + 1}: Consumption value for ${gradeName} is required`;
              tableErrors.push(errorMsg);
            } else {
              // Validate that the consumption is a positive number
              if (consumption <= 0) {
                const errorMsg = `Speed ${index + 1}: Consumption value for ${gradeName} must be a positive number`;
                tableErrors.push(errorMsg);
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
      tableErrors.push('At least one ballast record with valid speed and consumption data is required');
    }
    
    if (!hasValidLaden) {
      tableErrors.push('At least one laden record with valid speed and consumption data is required');
    }
    
    // If there are table errors, show them and return
    if (tableErrors.length > 0) {
      const errorDescription = `Please fill in the required fields:\n${tableErrors.join('\n')}`;
      
      try {
        showErrorNotification({
          title: "Table Validation Error",
          description: errorDescription
        });
      } catch (error) {
        console.error('ShipsForm - Error notification failed, using fallback alert:', error);
        // Fallback to browser alert if notification fails
        alert(`Table Validation Error:\n${errorDescription}`);
      }
      
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    
    try {
      // Transform speed consumptions to the new format for saving (one record per grade)
      const transformedSpeedConsumptions = speedConsumptions.flatMap(item => {
        const entries = Object.entries(item.consumptions || {});
        return entries
          .filter(([, consumption]) => consumption)
          .map(([gradeId, consumption]) => {
            // Find the grade name from gradeItems
            const gradeItem = gradeItems.find(grade => grade.gradeId === Number(gradeId));
            const gradeName = gradeItem?.gradeName || '';
            
            return {
              id: item.id,
              speed: item.speed,
              mode: item.mode,
              gradeId: Number(gradeId),
              gradeName: gradeName,
              consumption: consumption,
              isDefault: item.isDefault || false, // Add isDefault property
            };
          });
      });

      // Ensure grades have proper sequential sortOrder values before sending to API
      const gradesWithOrder = gradeItems.map((grade, index) => ({
        ...grade,
        sortOrder: index + 1
      }));

      // Combine all data into the ship object
      const completeShipData: Vessel = {
        ...shipData,
        vesselGrades: gradesWithOrder,
        vesselJson: JSON.stringify({
         speedConsumptions: transformedSpeedConsumptions
        })
      } as Vessel;

      const response = await addShip(completeShipData);
      
      if (response && (response.status === 200 || response.status === 201 || response.data)) {
        showSuccessNotification({
          title: mode === 'edit' ? "Vessel Updated" : "Vessel Created",
          description: `Vessel "${shipData.name}" has been ${mode === 'edit' ? 'updated' : 'created'} successfully.`
        });
        onSubmit(completeShipData);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      showErrorNotification({
        title: mode === 'edit' ? "Update Failed" : "Creation Failed",
        description: error?.response?.data?.message || error?.message || "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to clear error for a specific field
  const clearError = (field: string) => {

    setErrors(prev => {
      const { [field]: removed, ...rest } = prev;
  
      return rest;
    });
  };

  return (
    <div className={pageWrapper}>
      <div className={sectionContainer}>
        <div className={topBar}>
          <Button
            variant="ghost"
            className={buttonBack}
            onClick={onCancel}
          >
            <ArrowLeft className="w-4 h-4 -translate-y-[1px]" />
            Back
          </Button>
          <Button 
            className={buttonSave} 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                {mode === 'edit' ? 'Updating...' : 'Saving...'}
              </div>
            ) : (
              mode === 'edit' ? 'Update' : 'Save'
            )}
          </Button>
        </div>
        <div className={heading}>{mode === 'edit' ? 'Edit Vessel' : 'Add Vessel'}</div>

        <form onSubmit={handleSubmit}>
          {/* Show all three components at once */}
          <ShipGeneralInfo
            initialData={shipData}
            onNext={handleGeneralInfoChange}
            onCancel={onCancel}
            mode={mode}
            errors={errors}
            onClearError={clearError}
            validateField={validateField}
          />
          
          <ShipGrades
            shipData={shipData}
            gradeItems={gradeItems}
            onNext={handleGradesChange}
            onBack={() => {}}
            onCancel={onCancel}
            mode={mode}
          />
          
          <ShipSpeedConsumption
            shipData={shipData}
            gradeItems={gradeItems}
            speedConsumptions={speedConsumptions}
            onNext={handleSpeedConsumptionChange}
            onBack={() => {}}
            onCancel={onCancel}
            onSubmit={() => {}}
            mode={mode}
          />
        </form>
      </div>
    </div>
  );
} 
