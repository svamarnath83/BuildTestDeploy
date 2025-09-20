'use client';

import React, { useMemo } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Label } from './label';

export interface SelectOption {
  value: string;
  label: string;
  displayValue?: string;
}

interface MultiSelectProps {
  label?: string;
  placeholder: string;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
  className?: string;
  options: SelectOption[];
  isMulti?: boolean;
  isSearchable?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCodeOnly?: boolean;
}

const animatedComponents = makeAnimated();

export default function MultiSelect({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  className,
  options,
  isMulti = true,
  isSearchable = true,
  isClearable = true,
  disabled = false,
  size = 'md',
  showCodeOnly = false
}: MultiSelectProps) {
  // Custom components for code display
  const customComponents = useMemo(() => {
    if (!showCodeOnly) return animatedComponents;
    
    return {
      ...animatedComponents,
      MultiValueLabel: ({ children, ...props }: any) => {
        const option = props.data;
        return (
          <div {...props.innerProps}>
            {option.displayValue || option.label}
          </div>
        );
      }
    };
  }, [showCodeOnly]);

  // Styles to match textbox styling
  const styles = useMemo(() => ({
    control: (base: any, state: any) => ({
      ...base,
      minHeight: size === 'sm' ? '28px' : size === 'lg' ? '44px' : '32px',
      border: 'none',
      borderBottom: '1px solid #d1d5db',
      borderRadius: '0',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      '&:hover': {
        borderBottom: '1px solid #9ca3af'
      },
      '&:focus-within': {
        borderBottom: '2px solid #3b82f6',
        boxShadow: 'none'
      }
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '0',
      fontSize: '14px',
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
      color: '#3d4150'
    }),
    input: (base: any) => ({
      ...base,
      fontSize: '14px',
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
      color: '#3d4150',
      margin: '0',
      padding: '0'
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: '14px',
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
      color: '#9ca3af'
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      margin: '2px 4px 2px 0'
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: '#374151',
      fontSize: '12px',
      padding: '2px 6px'
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#6b7280',
      '&:hover': {
        backgroundColor: '#d1d5db',
        color: '#374151'
      }
    }),
    menu: (base: any) => ({
      ...base,
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 9999
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
          ? '#f3f4f6' 
          : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontSize: '14px',
      fontFamily: "'Segoe UI', 'Arial', sans-serif",
      '&:hover': {
        backgroundColor: state.isSelected ? '#2563eb' : '#e5e7eb'
      }
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      padding: '0'
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: () => ({
      display: 'none'
    }),
    clearIndicator: (base: any) => ({
      ...base,
      color: '#6b7280',
      padding: '0 8px',
      '&:hover': {
        color: '#374151'
      }
    })
  }), [size]);

  return (
    <div className={className}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
        </Label>
      )}
      <Select
        isMulti={isMulti}
        value={value}
        onChange={(newValue) => onChange(newValue as SelectOption[])}
        options={options}
        placeholder={placeholder}
        components={customComponents}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={disabled}
        styles={styles}
        className="text-sm"
      />
    </div>
  );
} 