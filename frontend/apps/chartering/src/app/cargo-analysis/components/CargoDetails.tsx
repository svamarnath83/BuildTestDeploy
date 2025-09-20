'use client';

import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
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
  getOptionAndName,
  Option,
  DropdownField,
  AsyncMultiSelect,
  AsyncSelectOption,
  DatePicker
} from '@commercialapp/ui';
import { ChevronDown } from 'lucide-react';
import { CargoInput, cargoFormSchema, type CargoFormData } from '../libs/index';
import { getCommodity } from '@commercialapp/ui';
import { getUnitOfMeasure } from '@commercialapp/ui';
import { getCurrency } from '@commercialapp/ui';
import { getPort } from '@commercialapp/ui';
import { getShips } from '@commercialapp/ui';
import { UnitOfMeasure } from '@commercialapp/ui';
import { Currency } from '@commercialapp/ui';
import { Vessel } from '../libs/models';


interface CargoDetailsProps {
  cargoInput: CargoInput;
  onCargoInputChange: (cargoInput: CargoInput) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLoadPortsChange?: (loadPorts: string[], previousLoadPorts: string[]) => void;
}

export default function CargoDetails({ cargoInput, onCargoInputChange, onSubmit, onLoadPortsChange }: CargoDetailsProps) {
  const [commodities, setCommodities] = useState<Array<{ Code: string; Name: string }>>([]);
  const [unitsOfMeasure, setUnitsOfMeasure] = useState<UnitOfMeasure[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [ships, setShips] = useState<Vessel[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [hasManuallySetRateType, setHasManuallySetRateType] = useState(false);
  const [ports, setPorts] = useState<Array<{ Id: number; PortCode: string; Name: string }>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Transform ports data to options for AsyncMultiSelect
  const mapPortToOption = useCallback((port: { Id: number; PortCode: string; Name: string }): AsyncSelectOption => ({
    value: port.Name,
    label: `${port.Name}`, // Show full name with code in dropdown
    displayValue: port.Name // Show only port name in selected chips
  }), []);

  // Transform ships data to options for AsyncMultiSelect
  const mapShipToOption = useCallback((ship: Vessel): AsyncSelectOption => ({
    value: ship.id.toString(),
    label: `${ship.vesselName || ship.name} (${ship.imo}) - ${ship.dwt} DWT`,
    displayValue: ship.vesselName || ship.name
  }), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    const newCargoInput = {
      ...cargoInput,
      [name]: processedValue
    };
    onCargoInputChange(newCargoInput);
    
    // Clear any existing error for this field when value changes
    setErrors(prev => {
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
    
    // Validate field
    validateField(name, processedValue);
  };

  const handleSelectChange = (name: keyof CargoInput, value: string) => {
    const newCargoInput = {
      ...cargoInput,
      [name]: value
    };
    
    // Auto-sync rate type when quantity type is selected (first time only)
    if (name === 'quantityType' && !hasManuallySetRateType) {
      newCargoInput.rateType = value;
    }
    
    // Track when user manually sets rate type
    if (name === 'rateType') {
      setHasManuallySetRateType(true);
    }
    
    onCargoInputChange(newCargoInput);
    
    // Clear any existing error for this field when value changes
    setErrors(prev => {
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
    
    // Validate field
    validateField(name, value);
  };



  const handleLoadPortsChange = (selectedOptions: AsyncSelectOption[]) => {
    const loadPorts = selectedOptions.map(option => option.value.toString());
    const previousLoadPorts = [...cargoInput.loadPorts];
    
    const newCargoInput = {
      ...cargoInput,
      loadPorts
    };
  
    onCargoInputChange(newCargoInput);
    
    // Call the callback to update ship analysis positions if provided
    if (onLoadPortsChange) {
      onLoadPortsChange(loadPorts, previousLoadPorts);
    }
    
    // Clear any existing error for this field when value changes
    setErrors(prev => {
      const { loadPorts: removed, ...rest } = prev;
      return rest;
    });
    
    // Validate field
    validateField('loadPorts', loadPorts);
  };

  const handleDischargePortsChange = (selectedOptions: AsyncSelectOption[]) => {
    const dischargePorts = selectedOptions.map(option => option.value.toString());
    const newCargoInput = {
      ...cargoInput,
      dischargePorts
    };
    onCargoInputChange(newCargoInput);
    
    // Clear any existing error for this field when value changes
    setErrors(prev => {
      const { dischargePorts: removed, ...rest } = prev;
      return rest;
    });
    
    // Validate field
    validateField('dischargePorts', dischargePorts as any);
  };

  const handleShipsChange = (selectedOptions: AsyncSelectOption[]) => {
    const selectedShips = selectedOptions.map(option => parseInt(option.value.toString()));
    const newCargoInput = {
      ...cargoInput,
      selectedShips
    };
    onCargoInputChange(newCargoInput);
    
    // Clear any existing error for this field when value changes
    setErrors(prev => {
      const { selectedShips: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleCommodityChange = (selectedOption: Option | null) => {
    const commodity = selectedOption ? String(selectedOption.value) : '';
    const newCargoInput = {
      ...cargoInput,
      commodity,
    };
    onCargoInputChange(newCargoInput);
    
    // Clear any existing error for this field when value changes
    setErrors(prev => {
      const { commodity: removed, ...rest } = prev;
      return rest;
    });
    
    // Validate field
    validateField('commodity', commodity);
  };

  const loadCommodities = async () => {
    const commodities = await getCommodity();
    setCommodities(commodities.data);
  };

  const loadUnitsOfMeasure = async () => {
    const units = await getUnitOfMeasure();
    setUnitsOfMeasure(units.data);
  };

  const loadCurrencies = async () => {
    const currencies = await getCurrency();
    setCurrencies(currencies.data);
  };

  const loadPorts = async () => {
    const ports = await getPort();

    console.log('🔍 Ports:::', ports.data);
    setPorts(ports.data);
  };

  const loadShips = async () => {
    try {
      const shipsResponse = await getShips(true);
      if (shipsResponse.data) {
        setShips(shipsResponse.data as unknown as Vessel[]);
      }
    } catch (error) {
      console.error('Failed to load ships:', error);
    }
  };

  const mapCommodityToOption = (commodity: { Code: string; Name: string }): Option => ({
    value: commodity.Code,
    label: `${commodity.Code} - ${commodity.Name}`,
  });
  
  const commodityDropdown = getOptionAndName(cargoInput.commodity, commodities, 'Code', 'Name');

  // Validation functions
  const validateField = (name: string, value: unknown) => {
    try {
      const fieldSchema = cargoFormSchema.pick({ [name]: true });
      fieldSchema.parse({ [name]: value });
      setErrors(prev => {
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'errors' in err && 
        Array.isArray(err.errors) && err.errors[0] && typeof err.errors[0] === 'object' && 
        'message' in err.errors[0] ? String(err.errors[0].message) : 'Invalid input';
      setErrors(prev => ({ 
        ...prev, 
        [name]: errorMessage
      }));
    }
  };

  const validateForm = (): boolean => {
    // Validate with zod
    const result = cargoFormSchema.safeParse(cargoInput);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((err) => {
        if (typeof err.path[0] === 'string') fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
    else{
      console.log(errors);
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadCommodities();
    loadUnitsOfMeasure();
    loadCurrencies();
    loadPorts();
    loadShips();
  }, []);

  // Set default values after units are loaded
  useEffect(() => {
    if (unitsOfMeasure.length > 0 && (!cargoInput.quantityType || !cargoInput.rateType)) {
      const defaultUnit = unitsOfMeasure.find((unit: UnitOfMeasure) => unit.isDefault);
      console.log('🔍 Default unit found:', defaultUnit);
      
      if (defaultUnit && defaultUnit.id) {
        const updates: Partial<CargoInput> = {};
        
        if (!cargoInput.quantityType) {
          updates.quantityType = defaultUnit.id.toString();
          console.log('✅ Setting default quantity type:', defaultUnit.id);
        }
        
        if (!cargoInput.rateType) {
          updates.rateType = defaultUnit.id.toString();
          console.log('✅ Setting default rate type:', defaultUnit.id);
        }
        
        if (Object.keys(updates).length > 0) {
          const newCargoInput = { ...cargoInput, ...updates };
          console.log('🔄 Updating cargo input with defaults:', newCargoInput);
          onCargoInputChange(newCargoInput);
        }
      }
    }
  }, [unitsOfMeasure, cargoInput.quantityType, cargoInput.rateType, onCargoInputChange]);


  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cargo Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Placeholder content to prevent layout shift */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
                      <CardTitle className="text-sm font-medium">Cargo Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <FormItem>
              <div className="flex items-center gap-2">
                <Label htmlFor="commodity" className={`${labelText} ${errors.commodity ? 'text-[#ff0000]' : ''}`}>Commodity</Label>
                {errors.commodity && <small className="text-[#ff0000] text-[10px]">Required</small>}
              </div>
              <Select 
                value={cargoInput.commodity} 
                onValueChange={(value: string) => handleCommodityChange({ value, label: value } as Option)}
              >
                <SelectTrigger className={`border-b ${( errors.commodity) ? 'border-[#ff0000]' : 'border-gray-300'} focus:border-blue-600 focus:outline-none bg-transparent shadow-none`}>
                <SelectValue placeholder="Select commodity" />
                </SelectTrigger>
                <SelectContent>
                  {commodities.map((commodity) => (
                    <SelectItem key={commodity.Code} value={commodity.Code || ''}>
                      {commodity.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
            
            <FormItem>
              <div className="flex items-center gap-2">
                <Label htmlFor="quantity" className={`${labelText} ${(errors.quantity || errors.quantityType) ? 'text-[#ff0000]' : ''}`}>Quantity</Label>
                {(errors.quantity || errors.quantityType) && <small className="text-[#ff0000] text-[10px]">Required</small>}
              </div>
              {/* Responsive design: horizontal on large screens, vertical on small/medium */}
              <div className="lg:flex lg:items-end lg:flex-row flex-col space-y-2 lg:space-y-0">
                <Input 
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={cargoInput.quantity}
                  onChange={handleInputChange}
                  placeholder="50000"
                  required
                  className={`${valueText} border-b ${(errors.quantity ) ? 'border-[#ff0000]' : 'border-gray-300'} focus:border-blue-600 focus:outline-none lg:w-24 w-full`}
                />
                <Select 
                  value={cargoInput.quantityType} 
                  onValueChange={(value: string) => handleSelectChange('quantityType', value)}
                >
                  <SelectTrigger className={`border-b ${( errors.quantityType) ? 'border-[#ff0000]' : 'border-gray-300'} focus:border-blue-600 focus:outline-none text-blue-600 bg-transparent shadow-none`}>
                    <SelectValue />
                    {(!cargoInput.quantityType || cargoInput.quantityType === '') && <ChevronDown className="text-blue-600 w-4 h-4" />}
                  </SelectTrigger>
                  <SelectContent>
                    {unitsOfMeasure.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id?.toString() || ''}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormItem>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <Label className={`${labelText} ${errors.loadPorts ? 'text-[#ff0000]' : ''}`}>Load Ports</Label>
                {errors.loadPorts && <small className="text-[#ff0000] text-[10px]">Required</small>}
              </div>
              <AsyncMultiSelect
                placeholder="Select load ports"
                value={cargoInput.loadPorts.map(portName => ({
                  value: portName,
                  label: portName,
                  displayValue: portName
                }))}
                onChange={handleLoadPortsChange}
                data={ports}
                mapToOption={mapPortToOption}
                showCodeOnly={true}
              />
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <Label className={`${labelText} ${errors.dischargePorts ? 'text-[#ff0000]' : ''}`}>Discharge Ports</Label>
                {errors.dischargePorts && <small className="text-[#ff0000] text-[10px]">Required</small>}
              </div>
              <AsyncMultiSelect
                placeholder="Select discharge ports"
                value={cargoInput.dischargePorts.map(portName => ({
                  value: portName,
                  label: portName,
                  displayValue: portName
                }))}
                onChange={handleDischargePortsChange}
                data={ports}
                mapToOption={mapPortToOption}
                showCodeOnly={true}
              />
            </div>
            

            
            <FormItem>
              <div className="flex items-center gap-2">
                <Label htmlFor="rate" className={`${labelText} ${(errors.rate || errors.currency || errors.rateType) ? 'text-[#ff0000]' : ''}`}>Rate</Label>
                {(errors.rate || errors.currency || errors.rateType) && <small className="text-[#ff0000] text-[10px]">Required</small>}
              </div>
              {/* Responsive design: horizontal on large screens, vertical on small/medium */}
              <div className="lg:flex lg:items-end lg:flex-row flex-col space-y-2 lg:space-y-0">
                <Select 
                  value={cargoInput.currency} 
                  onValueChange={(value: string) => handleSelectChange('currency', value)}
                >
                  <SelectTrigger className={`border-b ${(errors.currency) ? 'border-[#ff0000]' : 'border-gray-300'} focus:border-blue-600 focus:outline-none text-blue-600 bg-transparent shadow-none`}>
                    <SelectValue />
                    {(!cargoInput.currency || cargoInput.currency === '') && <ChevronDown className="text-blue-600 w-4 h-4" />}
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.Code} value={currency.Code || ''}>
                        {currency.Code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="lg:block hidden w-px h-6 bg-gray-300 mx-2 self-end"></div>
                <Input 
                  id="rate"
                  name="rate"
                  type="number"
                  step="0.01"
                  value={cargoInput.rate}
                  onChange={handleInputChange}
                  placeholder="25.00"
                  required
                  className={`${valueText} border-b ${(errors.rate) ? 'border-[#ff0000]' : 'border-gray-300'} focus:border-blue-600 focus:outline-none lg:w-20 w-full`}
                />
                <Select 
                  value={cargoInput.rateType} 
                  onValueChange={(value: string) => handleSelectChange('rateType', value)}
                >
                  <SelectTrigger className={`border-b ${( errors.rateType) ? 'border-[#ff0000]' : 'border-gray-300'} focus:border-blue-600 focus:outline-none text-blue-600 bg-transparent shadow-none`}>
                    <SelectValue />
                    {(!cargoInput.rateType || cargoInput.rateType === '') && <ChevronDown className="text-blue-600 w-4 h-4" />}
                  </SelectTrigger>
                  <SelectContent>
                    {unitsOfMeasure.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id?.toString() || ''}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormItem>
            
            <FormItem>
              <div className="flex items-center gap-2">
                <Label htmlFor="laycanFrom" className={`${labelText} ${errors.laycanFrom ? 'text-[#ff0000]' : ''}`}>Laycan From</Label>
                {errors.laycanFrom && <small className="text-[#ff0000] text-[10px]">Required</small>}
              </div>
              <DatePicker 
                id="laycanFrom"
                name="laycanFrom"
                value={cargoInput.laycanFrom ? new Date(cargoInput.laycanFrom) : undefined}
                onChange={(value) => {
                  const newCargoInput = {
                    ...cargoInput,
                    laycanFrom: value ? format(value, 'yyyy-MM-dd') : ''
                  };
                  onCargoInputChange(newCargoInput);
                  
                  // Clear any existing error for this field when value changes
                  setErrors(prev => {
                    const { laycanFrom: removed, ...rest } = prev;
                    return rest;
                  });
                  
                  // Validate field
                  validateField('laycanFrom', value ? format(value, 'yyyy-MM-dd') : '');
                }}
                minDate={new Date()}
              />
            </FormItem>
            
            <FormItem>
              <div className="flex items-center gap-2">
                <Label htmlFor="laycanTo" className={`${labelText} ${errors.laycanTo ? 'text-[#ff0000]' : ''}`}>Laycan To</Label>
                {errors.laycanTo && <small className="text-[#ff0000] text-[10px]">Required</small>}
              </div>
              <DatePicker 
                id="laycanTo"
                name="laycanTo"
                value={cargoInput.laycanTo ? new Date(cargoInput.laycanTo) : undefined}
                onChange={(value) => {
                  const newCargoInput = {
                    ...cargoInput,
                    laycanTo: value ? format(value, 'yyyy-MM-dd') : ''
                  };
                  onCargoInputChange(newCargoInput);
                  
                  setErrors(prev => {
                    const { laycanTo: removed, ...rest } = prev;
                    return rest;
                  });
                  
                  // Validate field
                  validateField('laycanTo', value ? format(value, 'yyyy-MM-dd') : '');
                }}
                minDate={new Date()}
              />
            </FormItem>
            
            <FormItem>
              <div className="flex items-center gap-2 mb-2">
                <Label className={`${labelText}`}>Ships (Optional)</Label>
                <small className="text-gray-500 text-[10px]">Leave empty to analyze all ships</small>
              </div>
              <AsyncMultiSelect
                placeholder="Select specific ships for analysis"
                value={(cargoInput.selectedShips || []).map(shipId => ({
                  value: shipId.toString(),
                  label: ships.find(s => s.id === shipId)?.vesselName || ships.find(s => s.id === shipId)?.name || shipId.toString(),
                  displayValue: ships.find(s => s.id === shipId)?.vesselName || ships.find(s => s.id === shipId)?.name || shipId.toString()
                }))}
                onChange={handleShipsChange}
                data={ships}
                mapToOption={mapShipToOption}
                showCodeOnly={false}
              />
            </FormItem>
          </div>
          
          <Button 
            type="submit" 
          >
            Analyze Ships
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 