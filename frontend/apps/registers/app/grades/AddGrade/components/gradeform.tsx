'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { addGrade, Grade, defaultGrade, gradeFormSchema } from '@commercialapp/ui';
import { 
  showSuccessNotification, 
  showErrorNotification 
} from '@commercialapp/ui/src/components/ui/react-hot-toast-notifications';
import {
  Button,
  Input,
  Checkbox,
  Label,
  FormItem,
  pageWrapper,
  sectionContainer,
  topBar,
  buttonBack,
  buttonSave,
  heading,
  labelText,
  valueText,
  subheading,
} from '@commercialapp/ui';
import GradeInfo from './GradeInfo';
import { ArrowLeft } from 'lucide-react';

interface GradeFormProps {
  initialData?: Partial<Grade>;
  onSubmit: (data: Grade) => void;
  onCancel: () => void;
  mode?: 'add' | 'edit';
}

export default function GradeForm({
  initialData = {},
  onSubmit,
  onCancel,
  mode = 'add',
}: GradeFormProps) {
  const [form, setForm] = useState<Grade>({ ...defaultGrade, ...initialData });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Live validation for individual fields
  const validateField = (name: string, value: string) => {
    try {
      const fieldType = getFieldType(name as keyof Grade);
      let processedValue: any = value;
      
      // Convert value to proper type before validation
      if (fieldType === 'number') {
        processedValue = value === '' ? null : parseFloat(value);
        // Skip validation if empty (will be caught at form submission)
        if (value === '') return;
      }
      
      gradeFormSchema.pick({ [name]: true }).parse({ [name]: processedValue });
      setErrors(prev => {
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [name]: err.errors?.[0]?.message || 'Invalid input' }));
    }
  };

  // Helper function to get the expected type for a field based on Grade model
  const getFieldType = (fieldName: keyof Grade): 'string' | 'number' | 'boolean' => {
    // Type-safe field type mapping based on Grade interface
    const fieldTypes: Record<keyof Grade, 'string' | 'number' | 'boolean'> = {
      id: 'number',
      name: 'string',
      price: 'number',
      inUse: 'boolean'
    };
    
    return fieldTypes[fieldName] || 'string';
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | boolean
  ) => {
    let name: string;
    let value: any;
    let type: string;
    let checked: boolean;

    if (typeof e === 'boolean') {
      // Handle checkbox change from GradeInfo component
      name = 'inUse';
      value = e;
      type = 'checkbox';
      checked = e;
    } else {
      // Handle regular input change
      const target = e.target as any;
      name = target.name;
      value = target.value;
      type = target.type;
      checked = target.checked;
    }
    
    // Convert value based on field type
    let processedValue = type === 'checkbox' ? checked : value;
    const fieldType = getFieldType(name as keyof Grade);
    
    if (fieldType === 'number') {
      processedValue = value === '' ? null : parseFloat(value);
    }
    
    setForm(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear any existing error for this field when value changes
    setErrors(prev => {
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
    
    // Run validation for specific fields
    if (["name", "price"].includes(name)) {
      validateField(name, value);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    // Validate with zod
    const result = gradeFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((err) => {
        if (typeof err.path[0] === 'string') fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      showErrorNotification({
        title: "Validation Error",
        description: "Please check the required fields and correct any errors."
      });
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    try {
      const cleanedForm = emptyStringsToNull(form) as Grade;
      console.log('Submitting form:', cleanedForm);
      
      const response = await addGrade(cleanedForm);
      console.log('API Response:', response);
      
      // Check if the response indicates success
      if (response && (response.status === 200 || response.status === 201 || response.data)) {
        showSuccessNotification({
          title: mode === 'edit' ? "Grade Updated" : "Grade Created",
          description: `Grade "${form.name}" has been ${mode === 'edit' ? 'updated' : 'created'} successfully.`
        });
        onSubmit(form);
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

  function emptyStringsToNull(obj: Record<string, any>) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const fieldType = getFieldType(key as keyof Grade);
        
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
        <div className={heading}>{mode === 'edit' ? 'Edit Grade' : 'Add Grade'}</div>

        <form onSubmit={handleSubmit}>
          <GradeInfo 
            form={form}
            errors={errors}
            handleChange={handleChange}
          />
        </form>
      </div>
    </div>
  );
} 