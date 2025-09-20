import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Button,
  pageWrapper,
  sectionContainer,
  topBar,
  buttonBack,
  buttonSave,
  heading,
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
} from '@commercialapp/ui';
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import { Vessel, VesselGrade, getGrade, vesselGradeSchema } from '@commercialapp/ui';
import { getUnitOfMeasure } from '@commercialapp/ui';
import { showErrorNotification } from '@commercialapp/ui';

interface ShipGradesProps {
  shipData: Partial<Vessel>;
  gradeItems: VesselGrade[];
  onNext: (gradeItems: VesselGrade[]) => void;
  onBack: () => void;
  onCancel: () => void;
  mode?: 'add' | 'edit';
}

// Sortable Row Component
function SortableGradeRow({ 
  grade, 
  index, 
  handleGradeChange, 
  handleRemoveGrade,
  grades,
  onNext,
  gradeItems
}: { 
  grade: VesselGrade, 
  index: number, 
  handleGradeChange: (id: number, field: keyof VesselGrade, value: string | number) => void, 
  handleRemoveGrade: (id: number) => void,
  grades: Array<{ id: number; name: string }>,
  onNext: (gradeItems: VesselGrade[]) => void,
  gradeItems: VesselGrade[]
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: grade.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      className={`group transition-all duration-200 ease-in-out border-l-4 border-l-transparent hover:border-l-blue-400 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 py-0`}
    >
      <TableCell className={`px-3 py-0`}>
        <div className="flex items-center gap-2">
          <button 
            {...listeners} 
            className="p-1 cursor-grab hover:bg-gray-100 rounded"
            title="Drag to reorder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
          <Select
            value={grade.gradeId ? String(grade.gradeId) : ''}
            onValueChange={(value) => handleGradeChange(grade.id, 'gradeId', parseInt(value) || 0)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((gradeOption) => (
                <SelectItem key={gradeOption.id} value={String(gradeOption.id)}>
                  {gradeOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TableCell>
      <TableCell className={`px-3 ${index === 0 ? 'py-0' : 'py-1'}`}>
        <Select
          value={grade.type || 'primary'}
          onValueChange={(value) => handleGradeChange(grade.id, 'type', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className={`px-3 ${index === 0 ? 'py-0' : 'py-1'} flex flex-col items-center justify-center gap-1`}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => handleRemoveGrade(grade.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function ShipGrades({ 
  shipData, 
  gradeItems: initialGradeItems, 
  onNext, 
  onBack, 
  onCancel, 
  mode = 'add' 
}: ShipGradesProps) {
  console.log('ShipGrades - initialGradeItems:', initialGradeItems);
  
  // Ensure initial grades have proper sortOrder values
  const initialGradesWithSortOrder = initialGradeItems.map((grade, index) => ({
    ...grade,
    sortOrder: grade.sortOrder || index + 1
  }));
  
  const [gradeItems, setGradeItems] = useState<VesselGrade[]>(initialGradesWithSortOrder);
  const [nextGradeId, setNextGradeId] = useState(initialGradesWithSortOrder.length + 1);
  
  // State for API-loaded data
  const [grades, setGrades] = useState<Array<{ id: number; name: string }>>([]);
  const [unitsOfMeasure, setUnitsOfMeasure] = useState<Array<{ id: number; name: string }>>([]);
  const [metricTonId, setMetricTonId] = useState<number>(0);

  // State to track when we need to notify parent of changes
  const [pendingParentUpdate, setPendingParentUpdate] = useState<VesselGrade[] | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Effect to notify parent after state updates are complete
  useEffect(() => {
    if (pendingParentUpdate) {
      onNext(pendingParentUpdate);
      setPendingParentUpdate(null);
    }
  }, [pendingParentUpdate, onNext]);

  // Load data from APIs
  const loadGrades = async () => {
    try {
      const response = await getGrade();
      // Keep original order from API since sortOrder might be 0
      setGrades(response.data);
    } catch (error) {
      console.error('Failed to load grades:', error);
    }
  };

  const loadUnitsOfMeasure = async () => {
    try {
      const response = await getUnitOfMeasure();
      setUnitsOfMeasure(response.data);
      
      // Find default unit ID
      const defaultUnit = response.data.find((unit: { id: number; name: string; isDefault?: boolean }) => unit.isDefault);
      if (defaultUnit) {
        setMetricTonId(defaultUnit.id);
      }
    } catch (error) {
      console.error('Failed to load units of measure:', error);
    }
  };

  // Load all data on component mount
  useEffect(() => {
    console.log("gradeItems", gradeItems);
    loadGrades();
    loadUnitsOfMeasure();
  }, []);

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setGradeItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update sortOrder for all items based on their new position
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          sortOrder: index + 1
        }));
        
        console.log('🔄 Drag and drop completed - Updated sort order:', updatedItems.map(g => ({ id: g.id, sortOrder: g.sortOrder })));
        
        // Notify parent component of the reordered grades so sortOrder is synchronized
        setPendingParentUpdate(updatedItems);
        
        return updatedItems;
      });
    }
  };

  // Grade table handlers
  const handleAddGrade = () => {
    // Validate existing grades before adding new ones
    const validationErrors: string[] = [];
    
    gradeItems.forEach((grade, index) => {
      // Check if the grade has the minimum required data
      if (!grade.gradeId || grade.gradeId === 0) {
        validationErrors.push(`Grade ${index + 1}: Grade selection is required`);
        return;
      }
      
             // UOM is automatically set to default unit, so no validation needed
    });
    
    if (validationErrors.length > 0) {
      showErrorNotification({
        title: "Validation Error",
        description: `Please complete existing grades before adding new ones:\n${validationErrors.join('\n')}`
      });
      return;
    }
    
                   const newGrade: VesselGrade = {
        id: nextGradeId,
        gradeId: 0,
        uomId: metricTonId || 0,
        type: 'primary',
        vesselId: 0,
        gradeName: '',
        sortOrder: gradeItems.length + 1
      };
    const updatedGradeItems = [...gradeItems, newGrade];
    setGradeItems(updatedGradeItems);
    setNextGradeId(prev => prev + 1);
  };

  const handleRemoveGrade = (id: number) => {
    // Prevent removing the last grade - at least one grade is required
    if (gradeItems.length <= 1) {
      showErrorNotification({
        title: "Cannot Remove Grade",
        description: "At least one vessel grade is required. You cannot remove the last grade."
      });
      return;
    }
    
    const updatedGradeItems = gradeItems.filter(grade => grade.id !== id);
    
    // Reassign sortOrder for remaining items
    const reorderedItems = updatedGradeItems.map((grade, index) => ({
      ...grade,
      sortOrder: index + 1
    }));
    
    setGradeItems(reorderedItems);
  };

  const handleGradeChange = (id: number, field: keyof VesselGrade, value: string | number) => {
    const updatedGradeItems = gradeItems.map(grade => {
      if (grade.id === id) {
        const updatedGrade = { ...grade, [field]: value };
        
        // If gradeId is being updated, also update the gradeName
        if (field === 'gradeId') {
          const selectedGrade = grades.find(g => g.id === value);
          updatedGrade.gradeName = selectedGrade?.name || '';
        }
        
        // Preserve the sortOrder
        updatedGrade.sortOrder = grade.sortOrder;
        
        return updatedGrade;
      }
      return grade;
    });
    
    setGradeItems(updatedGradeItems);
  };

  // Update local state when prop changes (only on mount or when prop actually changes)
  const isInitialMount = React.useRef(true);
  
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Only update if the prop has actually changed
    const currentString = JSON.stringify(gradeItems);
    const newString = JSON.stringify(initialGradeItems);
    
    if (currentString !== newString) {
      console.log('ShipGrades - useEffect - initialGradeItems changed:', initialGradeItems);
      
      // Ensure proper sortOrder values are assigned
      const itemsWithSortOrder = initialGradeItems.map((grade, index) => ({
        ...grade,
        sortOrder: grade.sortOrder || index + 1
      }));
      
      setGradeItems(itemsWithSortOrder);
      setNextGradeId(itemsWithSortOrder.length + 1);
    }
  }, [initialGradeItems]);

  // Automatically set UOM to default unit for all grades when default unit ID is available
  useEffect(() => {
    if (metricTonId > 0 && gradeItems.length > 0) {
      const updatedGradeItems = gradeItems.map(grade => ({
        ...grade,
        uomId: metricTonId,
        sortOrder: grade.sortOrder || gradeItems.indexOf(grade) + 1
      }));
      setGradeItems(updatedGradeItems);
    }
  }, [metricTonId, gradeItems.length]);

  return (
    <div>
      {/* Grades Section */}
      <div className="mb-6 p-4 border border-[#e6eaf0] rounded-[4px]">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-medium">Grades</h3>
        </div>
        
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table className="max-w-[800px] text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead>Grade</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={handleAddGrade}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <SortableContext
                items={gradeItems}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {gradeItems.map((grade, index) => (
                    <SortableGradeRow
                      key={`grade-${grade.id}-${index}`}
                      grade={grade}
                      index={index}
                      handleGradeChange={handleGradeChange}
                      handleRemoveGrade={handleRemoveGrade}
                      grades={grades}
                      onNext={onNext}
                      gradeItems={gradeItems}
                    />
                  ))}
                </TableBody>
              </SortableContext>
            </Table>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
