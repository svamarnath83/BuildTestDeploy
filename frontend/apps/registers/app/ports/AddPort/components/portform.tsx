'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { addPort, Area, Country, getArea, getCountry, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@commercialapp/ui';
import { 
  showSuccessNotification, 
  showErrorNotification 
} from '@commercialapp/ui';
import {
  Button,
  Input,
  Select,
  Checkbox,
  Label,           // import your Label component
  FormItem,
  pageWrapper,
  sectionContainer,
  topBar,
  buttonBack,
  buttonSave,
  heading,
  labelText,
  valueText,
  ETS_LIST,
  Port,
  selectText,
  subheading,        // if available, else just wrap in div
  defaultPort,
  checkboxStyle,
} from '@commercialapp/ui';
import PortInfo from './PortInfo';
import BerthInfo from './BerthInfo';
import { ArrowLeft, ChevronDown, Clock } from 'lucide-react';
import { AsyncSelect, Option } from "@commercialapp/ui";
import { portFormSchema } from '@commercialapp/ui';
import { getOptionAndName } from '@commercialapp/ui/libs/utils';
import { z } from 'zod';
import { 
  MODULE_ID,
  ActivityPanel
} from '@commercialapp/ui';

interface PortFormProps {
  initialData?: Partial<Port>;
  onSubmit: (data: Port) => void;
  onCancel: () => void;
  mode?: 'add' | 'edit';
}

export default function PortForm({
  initialData = {},
  onSubmit,
  onCancel,
  mode = 'add',
}: PortFormProps) {
  const [form, setForm] = useState<Port>({ ...defaultPort, ...initialData });
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  // Helper function to find country by ID
  const getCountryById = (id: number): Country | undefined => {
    return countries.find(c => c.id === id);
  };
  
  // Load countries data
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await getCountry();
        if (response?.data) {
          setCountries(response.data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Load data from additionalData when editing
  useEffect(() => {
    if (mode === 'edit' && initialData.additionalData) {
      try {
        const additionalData = JSON.parse(initialData.additionalData);
        const fieldsToLoad = ['Latitude', 'Longitude', 'ecaType', 'europe'];
        
        fieldsToLoad.forEach(field => {
          if (additionalData[field] !== undefined) {
            setForm(prev => ({ ...prev, [field]: additionalData[field] }));
          }
        });

        // Country is now handled as a direct field, not in additionalData
      } catch (error) {
        console.error('Error parsing additionalData:', error);
      }
    }
  }, [mode, initialData.additionalData]);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Live validation for individual fields
  const validateField = (name: string, value: string) => {
    try {
      console.log(`Validating field: ${name} with value: "${value}" (type: ${typeof value})`);
      
      const fieldType = getFieldType(name as keyof Port);
      let processedValue: any = value;
      
      // Convert value to proper type before validation
      if (fieldType === 'number') {
        processedValue = value === '' ? null : parseFloat(value);
        // Skip validation if empty (will be caught at form submission)
        if (value === '') return;
      }
      
      // Use the updated portFormSchema from the separate file
      console.log(`About to validate ${name} with processedValue:`, processedValue);
      portFormSchema.pick({ [name]: true }).parse({ [name]: processedValue });
      console.log(`Validation passed for ${name}`);
      
      setErrors(prev => {
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    } catch (err: any) {
      console.log(`Validation failed for ${name}:`, err.errors?.[0]?.message);
      console.log(`Full error object:`, err);
      setErrors(prev => ({ ...prev, [name]: err.errors?.[0]?.message || 'Invalid input' }));
    }
  };
  // Helper function to get the expected type for a field based on Port model
  const getFieldType = (fieldName: keyof Port): 'string' | 'number' | 'boolean' => {
    // Type-safe field type mapping based on Port interface
    const fieldTypes: Record<keyof Port, 'string' | 'number' | 'boolean'> = {
      Id: 'number',
      PortCode: 'string',
      Name: 'string',
      unctadCode: 'string',
      utc: 'string',
      Latitude: 'string',  // Back to string - will validate format when value exists
      Longitude: 'string', // Back to string - will validate format when value exists
      netpasCode: 'string',
      ecaType: 'string',
      ets: 'string',
      IsEurope: 'boolean',
      historical: 'boolean',
      IsActive: 'boolean',
      additionalData: 'string',
      country: 'number'
    };
    
    return fieldTypes[fieldName] || 'string';
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    
    // Convert value based on field type
    let processedValue = type === 'checkbox' ? checked : value;
    const fieldType = getFieldType(name as keyof Port);
    
    if (fieldType === 'number') {
      processedValue = value === '' ? null : parseFloat(value);
    }
    
    setForm(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear any existing error for this field when value changes
    setErrors(prev => {
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
    
    // Run validation for fields that need it
    if (["PortCode", "Name", "portName", "unctadCode", "utc", "netpasCode", "ecaType", "country"].includes(name)) {
      validateField(name, value);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // No schedule dialog here; handled inside ActivityPanel
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    // Create a validation schema that includes all form fields
    const formValidationSchema = portFormSchema;
    
    // Validate with the updated schema
    const result = formValidationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((err) => {
        if (typeof err.path[0] === 'string') {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      console.log('Field errors:', fieldErrors);
      setErrors(fieldErrors);
      showErrorNotification({
        title: "Validation Error",
        description: "Please check the required fields and correct any errors."
      });
      return;
    }

    // Additional validation for country selection (country is now a direct field)
    if (!form.country || form.country === 0) {
      setErrors(prev => ({ ...prev, country: 'Country is required' }));
      showErrorNotification({
        title: "Validation Error",
        description: "Please select a country."
      });
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    try {
      const cleanedForm = emptyStringsToNull(form) as Port;
      
      // Move specified fields to additionalData as JSON
      const fieldsToMove = ['Latitude', 'Longitude', 'ecaType', 'europe'];
      const additionalDataObj: Record<string, any> = {};
      
      fieldsToMove.forEach(field => {
        if (cleanedForm[field as keyof Port] !== null && cleanedForm[field as keyof Port] !== undefined) {
          additionalDataObj[field] = cleanedForm[field as keyof Port];
          // Remove the field from the main form
          delete (cleanedForm as any)[field];
        }
      });

      // Country is now handled as a direct field, not in additionalData
      
      // Set additionalData as JSON string
      cleanedForm.additionalData = JSON.stringify(additionalDataObj);
      
      console.log('Submitting form:', cleanedForm);
      
      const response = await addPort(cleanedForm);
      console.log('API Response:', response);
      
      // Check if the response indicates success
      if (response && (response.status === 200 || response.status === 201 || response.data)) {
        showSuccessNotification({
          title: mode === 'edit' ? "Port Updated" : "Port Created",
          description: `Port "${cleanedForm.Name}" has been ${mode === 'edit' ? 'updated' : 'created'} successfully.`
        });
        onSubmit({ ...cleanedForm });
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


  function clearError(field: string) {
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }

  function emptyStringsToNull(obj: Record<string, any>) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const fieldType = getFieldType(key as keyof Port);
        
        if (fieldType === 'number') {
          // For number fields, convert empty strings to null, keep numbers as is
          return [key, value === "" || value === null ? null : value];
        }
        // For other fields, convert empty strings to null
        return [key, value === "" ? null : value];
      })
    );
  }

  return (
    <div className={`${pageWrapper} flex flex-col gap-4`}>
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
          <div className="flex gap-2">
            <button
              aria-label="View Activity"
              onClick={() => setShowActivity(true)}
              className="h-9 w-9 grid place-items-center rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              <Clock className="w-4 h-4" />
            </button>
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
        </div>
        <div className={heading}>{mode === 'edit' ? 'Edit Port' : 'Add Port'}</div>

        <form onSubmit={handleSubmit}>
          {/* General Info Section */}
          <div className="mb-6 p-4 border border-[#e6eaf0] rounded-[4px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-w-4xl">
              {/* Code */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="PortCode" className={`${labelText} ${errors.PortCode ? 'text-[#ff0000]' : ''}`}>Code</Label>
                  {errors.PortCode && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.PortCode}</small>}
                </div>
                <Input id="PortCode" name="PortCode" value={form.PortCode} onChange={handleChange} required className={valueText} maxLength={50} />
              </FormItem>
              {/* Port Name */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="Name" className={`${labelText} ${errors.Name ? 'text-[#ff0000]' : ''}`}>Port Name</Label>
                  {errors.Name && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.Name}</small>}
                </div>
                <Input
                  id="Name"
                  name="Name"
                  value={form.Name}
                  onChange={handleChange}
                  required
                  className={valueText}
                  maxLength={100}
                />
              </FormItem>
             
              {/* UNCTAD Code */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="unctadCode" className={`${labelText} ${errors.unctadCode ? 'text-[#ff0000]' : ''}`}>UNCTAD Code</Label>
                  {errors.unctadCode && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.unctadCode}</small>}
                </div>
                <Input
                  id="unctadCode"
                  name="unctadCode"
                  value={form.unctadCode ?? ''}
                  onChange={handleChange}
                  className={valueText}
                  maxLength={50}
                />
              </FormItem>
              {/* Country */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="country" className={`${labelText} ${errors.country ? 'text-[#ff0000]' : ''}`}>Country</Label>
                  {errors.country && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.country}</small>}
                </div>
                <Select 
                  value={form.country ? form.country.toString() : ''} 
                  onValueChange={(value: string) => {
                    const countryId = parseInt(value);
                    setForm(prev => ({ ...prev, country: countryId }));
                    // Clear error when dropdown changes
                    setErrors(prev => {
                      const { country: removed, ...rest } = prev;
                      return rest;
                    });
                  }}
                >
                  <SelectTrigger className={selectText}>
                    <SelectValue placeholder={loadingCountries ? "Loading..." : "Select Country"} />
                    {(!form.country || form.country === 0) && <ChevronDown className="text-blue-600 w-4 h-4" />}
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id.toString()}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-w-4xl mt-4">
              {/* UTC */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="utc" className={`${labelText} ${errors.utc ? 'text-[#ff0000]' : ''}`}>UTC +/-</Label>
                  {errors.utc && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.utc}</small>}
                </div>
                <div className="lg:flex lg:items-end lg:flex-row flex-col space-y-2 lg:space-y-0">
                <Input
                  id="utc"
                  name="utc"
                  type="number"
                  step="0.01"
                  value={form.utc ?? ''}
                  onChange={handleChange}
                  className={valueText}
                />
                <span className="text-blue-500 text-sm">Hrs</span>
                </div>
              </FormItem>
            </div>
          </div>
          <div className="border-gray-400" />

          {/* Location Section */}
          <div className="mb-6 p-4 border border-[#e6eaf0] rounded-[4px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-w-4xl">
              {/* Latitude */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="Latitude" className={`${labelText} ${errors.Latitude ? 'text-[#ff0000]' : ''}`}>Latitude</Label>
                  {errors.Latitude && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.Latitude}</small>}
                </div>
                <Input
                  id="Latitude"
                  name="Latitude"
                  type="text"
                  value={form.Latitude ?? ''}
                  onChange={handleChange}
                  className={valueText}
                />
              </FormItem>
              {/* Longitude */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="Longitude" className={`${labelText} ${errors.Longitude ? 'text-[#ff0000]' : ''}`}>Longitude</Label>
                  {errors.Longitude && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.Longitude}</small>}
                </div>
                <Input
                  id="Longitude"
                  name="Longitude"
                  type="text"
                  value={form.Longitude ?? ''}
                  onChange={handleChange}
                  className={valueText}
                />
              </FormItem>
              {/* NETPAS Code */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="netpasCode" className={`${labelText} ${errors.netpasCode ? 'text-[#ff0000]' : ''}`}>NETPAS Code</Label>
                  {errors.netpasCode && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.netpasCode}</small>}
                </div>
                <Input
                  id="netpasCode"
                  name="netpasCode"
                  value={form.netpasCode ?? ''}
                  onChange={handleChange}
                  className={valueText}
                  maxLength={50}
                />
              </FormItem>
            </div>
          </div>
          <div className="border-gray-400" />

          {/* Port Attributes Section */}
          <div className="mb-6 p-4 border border-[#e6eaf0] rounded-[4px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 max-w-4xl">
              {/* ETS */}
              <FormItem>
                <Label htmlFor="ets" className={labelText}>ETS</Label>
                <Select 
                  value={form.ets} 
                  onValueChange={(value: string) => setForm(prev => ({ ...prev, ets: value }))}                >
                  <SelectTrigger className={selectText}>
                    <SelectValue />
                    {(!form.ets || form.ets === '') && <ChevronDown className="text-blue-600 w-4 h-4" />}
                  </SelectTrigger>
                  <SelectContent>
                    {ETS_LIST.map((ets) => (
                      <SelectItem key={ets} value={ets || ''}>
                        {ets}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
              {/* ECA Type */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="ecaType" className={`${labelText} ${errors.ecaType ? 'text-[#ff0000]' : ''}`}>ECA Type</Label>
                  {errors.ecaType && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.ecaType}</small>}
                </div>
                <Select 
                  value={form.ecaType || 'none'} 
                  onValueChange={(value: 'china' | 'med' | 'seca' | 'none') => {
                    setForm(prev => ({ ...prev, ecaType: value }));
                    // Clear error when dropdown changes
                    setErrors(prev => {
                      const { ecaType: removed, ...rest } = prev;
                      return rest;
                    });
                  }}
                >
                  <SelectTrigger className={selectText}>
                    <SelectValue />
                    {(!form.ecaType || form.ecaType === 'none') && <ChevronDown className="text-blue-600 w-4 h-4" />}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No ECA</SelectItem>
                    <SelectItem value="china">China ECA</SelectItem>
                    <SelectItem value="med">Med ECA</SelectItem>
                    <SelectItem value="seca">SECA Zone</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
              {/* Europe */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="europe"
                  name="europe"
                  checked={form.IsEurope || false}
                  onCheckedChange={(checked) => {
                    setForm(prev => ({ ...prev, IsEurope: !!checked }));
                    // Clear error when checkbox changes
                    setErrors(prev => {
                      const { IsEurope: removed, ...rest } = prev;
                      return rest;
                    });
                  }}
                  className={checkboxStyle}
                />
                <Label htmlFor="IsEurope" className={`${labelText} ${errors.IsEurope ? 'text-[#ff0000]' : ''}`}>Europe</Label>
                {errors.IsEurope && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.IsEurope}</small>}
              </div>
            </div>
          </div>
          <div className="border-gray-400" />

          {/* Historical Section - Only show in edit mode */}
          {mode === 'edit' && (
            <div className="mb-6 p-4 border border-[#e6eaf0] rounded-[4px]">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="historical"
                  name="historical"
                  checked={form.historical || false}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, historical: !!checked }))}
                  className={checkboxStyle}
                  />
                <Label htmlFor="historical" className={labelText}>Historical</Label>
              </div>
            </div>
          )}
          <div className="border-gray-400" />
        
        </form>
        <div className="border-gray-400" />
        {/* Berth Info Section */}
        <BerthInfo />
      </div>
      {/* Right overlay Activity panel (half screen) */}
      <ActivityPanel 
        moduleId={MODULE_ID.PORT} 
        recordId={form.Id || 0}
        placement="right"
        overlay
        open={showActivity}
        onOpenChange={setShowActivity}
        title="Port Activity"
        className="z-50"
      />
    </div>
  );
}
