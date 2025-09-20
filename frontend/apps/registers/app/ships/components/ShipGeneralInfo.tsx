import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Input,
  Label,
  FormItem,
  labelText,
  valueText,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useDebounce,
  validateVesselCode,
  selectText,
} from '@commercialapp/ui';
import { Vessel, getVesselType } from '@commercialapp/ui';
import { 
  showErrorNotification 
} from '@commercialapp/ui/src/components/ui/react-hot-toast-notifications';

interface ShipGeneralInfoProps {
  initialData?: Partial<Vessel>;
  onNext: (data: Partial<Vessel>) => void;
  onCancel?: () => void;
  mode?: 'add' | 'edit';
  errors?: { [key: string]: string };
  onClearError?: (field: string) => void;
  validateField?: (name: string, value: unknown) => void;
}

export default function ShipGeneralInfo({ 
  initialData = {}, 
  onNext, 
  onCancel: _onCancel, 
  mode: _mode = 'add',
  errors: externalErrors = {},
  onClearError,
  validateField
}: ShipGeneralInfoProps) {
  const [form, setForm] = useState<Partial<Vessel>>({
    id: 0,
    name: '',
    code: '',
    dwt: 0,
    type: 0,
    runningCost: 0,
    vesselJson: '',
    ...initialData
  });
  const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});
  
  const errors = { ...externalErrors, ...localErrors };
  

  
  const [vesselTypes, setVesselTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoadingVesselTypes, setIsLoadingVesselTypes] = useState(false);
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  const debouncedVesselCode = useDebounce(form.code, 800);

  useEffect(() => {
    const loadVesselTypes = async () => {
      setIsLoadingVesselTypes(true);
      try {
        const response = await getVesselType();
        setVesselTypes(response.data);
      } catch (error) {
        console.error('Failed to load vessel types:', error);
        showErrorNotification({ description: "Failed to load vessel types" });
      } finally {
        setIsLoadingVesselTypes(false);
      }
    };
    loadVesselTypes();
  }, []);

  useEffect(() => {
    const validateCode = async () => {
      if (!debouncedVesselCode || debouncedVesselCode.trim() === '') {
        return;
      }

      if (_mode === 'edit' && debouncedVesselCode === initialData.code) {
        return;
      }

            setIsValidatingCode(true);
      try {
        const excludeId = _mode === 'edit' && initialData.id ? initialData.id : undefined;
        const codeToValidate = form.code || '';
        const response = await validateVesselCode(codeToValidate, excludeId);
        
        const data = response.data;
        
        if (data.exists) {
          const errorMessage = "Already in use.";
          setLocalErrors(prev => ({
            ...prev,
            code: errorMessage
          }));
        } else {
          setLocalErrors(prev => {
            const { code: _removed, ...rest } = prev;
            return rest;
          });
        }
      } catch (_error: unknown) {
        const errorMessage = "Failed to validate vessel code";
        setLocalErrors(prev => ({
          ...prev,
          code: errorMessage
        }));
      } finally {
        setIsValidatingCode(false);
      }
    };

    validateCode();
  }, [debouncedVesselCode, _mode, initialData.code, initialData.id, onClearError]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    let processedValue: string | number = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }
    
    const updatedForm = { ...form, [name]: processedValue };
    
    if (name === 'code') {
      console.log('✏️ Vessel code changed:', { 
        oldValue: form.code, 
        newValue: value 
      });
    }
    
    setForm(updatedForm);
    
    // Clear any existing error for this field when value changes
    if (onClearError) {
      onClearError(name);
    } else {
              setLocalErrors(prev => {
          const { [name]: _removed, ...rest } = prev;
          return rest;
        });
    }
    
    // Validate the field if validation function is provided
    if (validateField) {
      validateField(name, processedValue);
    }
    
    // Update parent component immediately
    onNext(updatedForm);
  };

  const handleVesselTypeChange = (value: string) => {
    const updatedForm = { ...form, type: Number(value) };
    setForm(updatedForm);
    
    // Clear any existing error for this field when value changes
    if (onClearError) {
      onClearError('type');
    }
    
    // Clear local errors for this field
    setLocalErrors(prev => {
      const { type: _removed, ...rest } = prev;
      return rest;
    });
    
    // Update parent component immediately
    onNext(updatedForm);
  };

  return (
    <div>
      {/* General Info Section */}
      <div className="mb-6 p-4 border border-[#e6eaf0] rounded-[4px]">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-medium">General Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-w-4xl">
          {/* Vessel Code */}
          <FormItem>
            <div className="flex items-center gap-2">
              <Label htmlFor="code" className={`${labelText} ${errors.code ? 'text-[#ff0000]' : ''}`}>Vessel Code</Label>
              {errors.code && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.code}</small>}
              {isValidatingCode && <small className="text-blue-500 text-[10px] mx-auto">Validating...</small>}
            </div>
            <Input 
              id="code" 
              name="code" 
              value={form.code || ''} 
              onChange={handleChange} 
              required 
              className={valueText}
              maxLength={50}
            />
          </FormItem>
          
          {/* Vessel Name */}
          <FormItem>
            <div className="flex items-center gap-2">
              <Label htmlFor="name" className={`${labelText} ${errors.name ? 'text-[#ff0000]' : ''}`}>Vessel Name</Label>
              {errors.name && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.name}</small>}
            </div>
            <Input id="name" name="name" value={form.name || ''} onChange={handleChange} required className={valueText} maxLength={100} />
          </FormItem>
          
          {/* Vessel Type */}
          <FormItem>
            <div className="flex items-center gap-2">
              <Label htmlFor="type" className={`${labelText} ${errors.type ? 'text-[#ff0000]' : ''}`}>Vessel Type</Label>
              {errors.type && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.type}</small>}
            </div>
            <Select onValueChange={handleVesselTypeChange} value={form.type?.toString() || ''} >
              <SelectTrigger className={selectText}>
                <SelectValue placeholder={isLoadingVesselTypes ? "Loading..." : "Select vessel type"} />
              </SelectTrigger>
              <SelectContent>
                {vesselTypes.map((vesselType) => (
                  <SelectItem key={vesselType.id} value={vesselType.id.toString()}>
                    {vesselType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          
          {/* DWT */}
          <FormItem>
            <div className="flex items-center gap-2">
              <Label htmlFor="dwt" className={`${labelText} ${errors.dwt ? 'text-[#ff0000]' : ''}`}>Dead Weight Tonnage</Label>
              {errors.dwt && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.dwt}</small>}
            </div>
            <Input 
              id="dwt" 
              name="dwt" 
              type="number"
              value={form.dwt || ''} 
              onChange={handleChange} 
              required 
              className={valueText} 
            />
          </FormItem>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-w-4xl mt-4">
          {/* Running Cost */}
          <FormItem>
            <div className="flex items-center gap-2">
              <Label htmlFor="runningCost" className={`${labelText} ${errors.runningCost ? 'text-[#ff0000]' : ''}`}>Running Cost</Label>
              {errors.runningCost && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.runningCost}</small>}
            </div>
            <Input 
              id="runningCost" 
              name="runningCost" 
              type="number"
              value={form.runningCost || ''} 
              onChange={handleChange} 
              required 
              className={valueText} 
            />
          </FormItem>
          <FormItem>
            <div className="flex items-center gap-2">
              <Label htmlFor="imo" className={`${labelText} ${errors.imo ? 'text-[#ff0000]' : ''}`}>IMO</Label>
              {errors.imo && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.imo}</small>}
            </div>
            <Input id="imo" type="number" maxLength={7} name="imo" value={form.imo || ''} onChange={handleChange} required className={valueText}  />
          </FormItem>
        </div>
      </div>
    </div>
  );
}
