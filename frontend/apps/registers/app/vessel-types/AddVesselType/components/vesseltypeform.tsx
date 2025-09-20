'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, FormItem } from '@commercialapp/ui';
import { VesselType, addVesselType, updateVesselType, getVesselCategories, VesselCategory } from '@commercialapp/ui';
import { 
  showSuccessNotification, 
  showErrorNotification 
} from '@commercialapp/ui';
import {
  pageWrapper,
  sectionContainer,
  topBar,
  buttonBack,
  buttonSave,
  heading,
  labelText,
  valueText,
  selectText,
} from '@commercialapp/ui';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface VesselTypeFormProps {
  initialData?: Partial<VesselType>;
  onSubmit: () => void;
  onCancel: () => void;
  mode?: 'add' | 'edit';
}

export default function VesselTypeForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  mode = 'add' 
}: VesselTypeFormProps) {
  const [form, setForm] = useState<VesselType>({ 
    id: 0, 
    name: '', 
    category: 0, 
    calcType: '', 
    categoryName: '',
    ...initialData 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<VesselCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Calculation type options for dropdown
  const calcTypeOptions = [
    { id: 'per_ton', name: 'Per Ton' },
    { id: 'per_unit', name: 'Per Unit' },
    { id: 'per_day', name: 'Per Day' },
    { id: 'per_voyage', name: 'Per Voyage' },
    { id: 'percentage', name: 'Percentage' },
    { id: 'fixed', name: 'Fixed Rate' },
    { id: 'weight', name: 'weight' },
    { id: 'volume', name: 'volume' },
  ];

  // Fetch vessel categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await getVesselCategories();
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching vessel categories:', error);
        showErrorNotification({
          title: "Error",
          description: "Failed to load vessel categories. Please refresh the page."
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
        setForm({ id: 0, name: '', category: 0, calcType: '', categoryName: '', ...initialData });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof VesselType]) {
      setErrors(prev => {
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: { [key: string]: string } = {};
    
    if (!form.name?.trim()) {
      newErrors.name = 'Vessel type name is required';
    }
    if (!form.category || form.category === 0) {
      newErrors.category = 'Category is required';
    }
    if (!form.calcType) {
      newErrors.calcType = 'Calculation type is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showErrorNotification({
        title: "Validation Error",
        description: "Please check the required fields and correct any errors."
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    
    try {
      if (mode === 'edit') {
        // For update, convert category to string to match UpdateVesselTypeRequest
      
        await addVesselType(form);
        showSuccessNotification({
          title: "Vessel Type Updated",
          description: `Vessel type "${form.name}" has been updated successfully.`
        });
      } else {
        // For add, use the form data directly as it matches VesselType interface
        await addVesselType(form);
        showSuccessNotification({
          title: "Vessel Type Created",
          description: `Vessel type "${form.name}" has been created successfully.`
        });
      }
      
      onSubmit();
    } catch (error: any) {
      console.error('Error saving vessel type:', error);
      showErrorNotification({
        title: mode === 'edit' ? "Update Failed" : "Creation Failed",
        description: error?.response?.data?.message || error?.message || "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <div className={heading}>{mode === 'edit' ? 'Edit Vessel Type' : 'Add Vessel Type'}</div>

        <form onSubmit={handleSubmit}>
          {/* General Info Section */}
          <div className="mb-6 p-4 border border-[#e6eaf0] rounded-[4px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-4xl">
              {/* Vessel Type Name */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="name" className={`${labelText} ${errors.name ? 'text-[#ff0000]' : ''}`}>
                    Vessel Type Name
                  </Label>
                  {errors.name && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.name}</small>}
                </div>
                <Input 
                  id="name" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  className={valueText} 
                  maxLength={100} 
                />
              </FormItem>

              {/* Category */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="category" className={`${labelText} ${errors.category ? 'text-[#ff0000]' : ''}`}>
                    Category
                  </Label>
                  {errors.category && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.category}</small>}
                </div>
                <Select 
                  value={form.category.toString()} 
                  onValueChange={(value: string) => {
                    setForm(prev => ({ ...prev, category: parseInt(value) }));
                    // Clear error when dropdown changes
                    if (errors.category) {
                      setErrors(prev => {
                        const { category: removed, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger className={selectText}>
                    <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select category"} />
                    {(!form.category || form.category === 0) && !isLoadingCategories && <ChevronDown className="text-blue-600 w-4 h-4" />}
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              {/* Calculation Type */}
              <FormItem>
                <div className="flex items-center gap-2">
                  <Label htmlFor="calcType" className={`${labelText} ${errors.calcType ? 'text-[#ff0000]' : ''}`}>
                    Calculation Type
                  </Label>
                  {errors.calcType && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.calcType}</small>}
                </div>
                <Select 
                  value={form.calcType} 
                  onValueChange={(value: string) => {
                    setForm(prev => ({ ...prev, calcType: value }));
                    // Clear error when dropdown changes
                    if (errors.calcType) {
                      setErrors(prev => {
                        const { calcType: removed, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                >
                  <SelectTrigger className={selectText}>
                    <SelectValue />
                    {(!form.calcType || form.calcType === '') && <ChevronDown className="text-blue-600 w-4 h-4" />}
                  </SelectTrigger>
                  <SelectContent>
                    {calcTypeOptions.map((calcType) => (
                      <SelectItem key={calcType.id} value={calcType.id}>
                        {calcType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
