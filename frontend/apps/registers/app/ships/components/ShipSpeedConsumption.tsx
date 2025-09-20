import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  valueText,
  Checkbox,
} from '@commercialapp/ui';
import { Plus, X } from 'lucide-react';
import { Vessel, VesselGrade, getGrade, showErrorNotification } from '@commercialapp/ui';

interface SpeedConsumptionItem {
  id: number;
  speed: string;
  mode: 'ballast' | 'laden' | 'port';
  consumptions: { [gradeId: number]: number };
  isDefault?: boolean; // Add default flag
}

interface ShipSpeedConsumptionProps {
  shipData: Partial<Vessel>;
  gradeItems: VesselGrade[];
  speedConsumptions: SpeedConsumptionItem[];
  onNext: (speedConsumptions: SpeedConsumptionItem[]) => void;
  onBack: () => void;
  onCancel: () => void;
  onSubmit: (data: Vessel) => void;
  mode?: 'add' | 'edit';
}

export default function ShipSpeedConsumption({
  shipData,
  gradeItems,
  speedConsumptions: initialSpeedConsumptions,
  onNext,
  onBack,
  onCancel,
  onSubmit,
  mode = 'add'
}: ShipSpeedConsumptionProps) {
  const [speedConsumptions, setSpeedConsumptions] = useState<SpeedConsumptionItem[]>(() => {
    // If we have initial data, use it
    if (initialSpeedConsumptions && initialSpeedConsumptions.length > 0) {
      return initialSpeedConsumptions;
    }
    
    // If no initial data, create default records to ensure at least one ballast and one laden
    return [
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
        isDefault: true // First ballast record is default
      },
      {
        id: 3,
        speed: '',
        mode: 'laden',
        consumptions: {},
        isDefault: true // First laden record is default
      }
    ];
  });
  const [nextSpeedConsumptionId, setNextSpeedConsumptionId] = useState(initialSpeedConsumptions.length + 1);
  const [grades, setGrades] = useState<Array<{ id: number; name: string }>>([]);

  // Mode options for dropdown
  const modeOptions = [
    { id: 'ballast', name: 'Ballast' },
    { id: 'laden', name: 'Laden' }
  ];

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

  // Update local state when props change
  useEffect(() => {
    setSpeedConsumptions(initialSpeedConsumptions);
    setNextSpeedConsumptionId(initialSpeedConsumptions.length + 1);
  }, [initialSpeedConsumptions]);

  // Speed and consumption table handlers
  const handleAddSpeedConsumption = () => {
    // Validate existing speed consumptions before adding new ones
    const validationErrors: string[] = [];
    
    speedConsumptions.forEach((item, index) => {
      // Skip validation for port row (id === 1) as it's always incomplete by design
      if (item.id === 1) {
        console.log(`Skipping port row ${index} - no validation needed`);
        return;
      }
      
      // For non-port rows, validate speed and mode
      if (!item.speed || item.speed.trim() === '') {
        validationErrors.push(`Speed ${index + 1}: Speed value is required`);
        return;
      }
      
      // Check if speed is a valid positive number
      const speedNum = parseFloat(item.speed);
      if (isNaN(speedNum) || speedNum <= 0) {
        validationErrors.push(`Speed ${index + 1}: Speed must be a positive number`);
        return;
      }
      
      // Check if mode is selected (should not be 'port' for non-port rows)
      if (!item.mode || item.mode === 'port') {
        validationErrors.push(`Speed ${index + 1}: Mode must be selected (Ballast or Laden)`);
        return;
      }
      
      // Check if at least one consumption value is provided
      const hasConsumption = Object.values(item.consumptions || {}).some(
        consumption => consumption && consumption > 0
      );
      
      if (!hasConsumption) {
        validationErrors.push(`Speed ${index + 1}: At least one consumption value is required`);
        return;
      }
    });
    
    if (validationErrors.length > 0) {
      // Try to show error notification, fallback to alert if it fails
      try {
        showErrorNotification({
          title: "Validation Error",
          description: `Please complete existing speed consumption records before adding new ones:\n${validationErrors.join('\n')}`
        });
      } catch (error) {
        // Fallback to browser alert
        alert(`Validation Error:\nPlease complete existing speed consumption records before adding new ones:\n${validationErrors.join('\n')}`);
      }
      return;
    }
    
    const newSpeedConsumption: SpeedConsumptionItem = {
      id: nextSpeedConsumptionId,
      speed: '',
      mode: 'ballast',
      consumptions: {},
      isDefault: false // New records are not default
    };
    const updatedSpeedConsumptions = [...speedConsumptions, newSpeedConsumption];
    setSpeedConsumptions(updatedSpeedConsumptions);
    setNextSpeedConsumptionId(prev => prev + 1);
    onNext(updatedSpeedConsumptions);
  };

  const handleRemoveSpeedConsumption = (id: number) => {
    // Don't allow removing the default port row (id: 1)
    if (id === 1) return;
    
    const itemToRemove = speedConsumptions.find(item => item.id === id);
    if (!itemToRemove) return;
    
    // Check if this is the last record of its type
    const remainingRecordsOfType = speedConsumptions.filter(item => 
      item.id !== id && item.mode === itemToRemove.mode
    );
    
    if (remainingRecordsOfType.length === 0) {
      showErrorNotification({
        title: "Cannot Remove Record",
        description: `At least one ${itemToRemove.mode} record is required. You cannot remove the last ${itemToRemove.mode} record.`
      });
      return;
    }
    
    const updatedSpeedConsumptions = speedConsumptions.filter(item => item.id !== id);
    setSpeedConsumptions(updatedSpeedConsumptions);
    onNext(updatedSpeedConsumptions);
  };

  const handleSpeedConsumptionChange = (id: number, field: keyof SpeedConsumptionItem, value: string) => {
    let updatedSpeedConsumptions = speedConsumptions.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );

    // If mode is changing, handle default state management
    if (field === 'mode') {
      const itemToUpdate = updatedSpeedConsumptions.find(item => item.id === id);
      if (itemToUpdate && itemToUpdate.mode !== 'port') {
        // If this item was default in its previous mode, we need to find another default
        const wasDefault = speedConsumptions.find(item => item.id === id)?.isDefault;
        
        if (wasDefault) {
          // Find another record of the same previous mode to make default
          const previousMode = speedConsumptions.find(item => item.id === id)?.mode;
          if (previousMode && previousMode !== 'port') {
            const otherRecordsOfPreviousMode = updatedSpeedConsumptions.filter(
              item => item.id !== id && item.mode === previousMode
            );
            
            if (otherRecordsOfPreviousMode.length > 0) {
              // Make the first available record of the previous mode the new default
              updatedSpeedConsumptions = updatedSpeedConsumptions.map(item =>
                item.id === otherRecordsOfPreviousMode[0].id 
                  ? { ...item, isDefault: true }
                  : item.mode === previousMode 
                    ? { ...item, isDefault: false }
                    : item
              );
            }
          }
        }
        
        // Don't automatically change defaults for the new mode
        // Just uncheck the current item's default flag when changing modes
        updatedSpeedConsumptions = updatedSpeedConsumptions.map(item =>
          item.id === id 
            ? { ...item, isDefault: false } // Uncheck default when changing modes
            : item
        );
      }
    }

    setSpeedConsumptions(updatedSpeedConsumptions);
    onNext(updatedSpeedConsumptions);
  };

  const handleConsumptionChange = (itemId: number, gradeId: number, value: number) => {
    const updatedSpeedConsumptions = speedConsumptions.map(item =>
      item.id === itemId ? {
        ...item,
        consumptions: { ...item.consumptions, [gradeId]: value }
      } : item
    );
    setSpeedConsumptions(updatedSpeedConsumptions);
    onNext(updatedSpeedConsumptions);
  };

  const handleDefaultChange = (itemId: number, checked: boolean) => {
    if (!checked) return; // Don't allow unchecking default
    
    const itemToUpdate = speedConsumptions.find(item => item.id === itemId);
    if (!itemToUpdate || itemToUpdate.mode === 'port') return;
    
    // Update all records of the same mode to uncheck their default flag
    const updatedSpeedConsumptions = speedConsumptions.map(item => {
      if (item.mode === itemToUpdate.mode) {
        return { ...item, isDefault: item.id === itemId };
      }
      return item;
    });
    
    setSpeedConsumptions(updatedSpeedConsumptions);
    onNext(updatedSpeedConsumptions);
  };


  return (
    <div>
      {/* Speed & Consumption Section */}
      <div className="mb-6 p-4 border border-[#e6eaf0] rounded-[4px]">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-medium">Speed & Consumption</h3>
        </div>

        <div className="overflow-x-auto">
          <Table className="max-w-[1000px] text-xs">
            <TableHeader>
              <TableRow>
                <TableHead>Speed</TableHead>
                <TableHead className="text-center">Default</TableHead>
                <TableHead>Mode</TableHead>
                {gradeItems.filter(grade => grade.gradeId).map(grade => {
                  // Find the grade name from the grades data
                  const gradeData = grades.find(g => g.id === grade.gradeId);
                  const gradeName = gradeData ? gradeData.name : `Grade ${grade.gradeId}`;
                  return (
                    <TableHead key={grade.id}>
                      {gradeName}
                    </TableHead>
                  );
                })}
                <TableHead>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-1"
                    onClick={handleAddSpeedConsumption}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {speedConsumptions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={''}>
                    {item.id === 1 ? (
                      <div className="">
                        {/* Empty for port row */}
                      </div>
                    ) : (
                      <Input
                        type="number"
                        step="0.1"
                        className={`${valueText} w-30 px-6`}
                        value={item.speed}
                        onChange={(e) => handleSpeedConsumptionChange(item.id, 'speed', e.target.value)}
                        placeholder="0.0"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {item.id === 1 ? (
                      <div className="px-4">
                        {/* Empty for port row */}
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Checkbox
                          checked={item.isDefault || false}
                          onCheckedChange={(checked) => handleDefaultChange(item.id, !!checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          disabled={item.mode === 'port'}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.id === 1 ? (
                      <div className="px-4">
                        Port
                      </div>
                    ) : (
                      <Select
                        value={item.mode}
                        onValueChange={(value) => handleSpeedConsumptionChange(item.id, 'mode', value as 'ballast' | 'laden')}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {modeOptions.map((modeOption) => (
                            <SelectItem key={modeOption.id} value={modeOption.id}>
                              {modeOption.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  {gradeItems.filter(grade => grade.gradeId).map(grade => (
                    <TableCell key={`${item.id}-${grade.id}`}>
                      <Input
                        type="number"
                        step="0.01"
                        className={`${valueText}  w-30 px-6`}
                        value={item.consumptions[grade.gradeId] || ''}
                        onChange={(e) => handleConsumptionChange(item.id, grade.gradeId, parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </TableCell>
                  ))}
                  <TableCell className='h-8 px-6 text-left align-middle whitespace-nowrap'>
                    {item.id !== 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSpeedConsumption(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="w-7 h-7 rounded">
                        {/* Empty for port row */}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
