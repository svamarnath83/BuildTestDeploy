'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { GroupBase, OptionsOrGroups } from 'react-select';
import { Label } from './label';

export interface AsyncSelectOption {
  value: string | number;
  label: string;
  displayValue?: string;
}

interface AsyncMultiSelectProps {
  label?: string;
  placeholder?: string;
  value: AsyncSelectOption[];
  onChange: (value: AsyncSelectOption[]) => void;
  className?: string;
  data: any[];
  mapToOption: (item: any) => AsyncSelectOption;
  pageSize?: number;
  debounceTimeout?: number;
  isDisabled?: boolean;
  isClearable?: boolean;
  showCodeOnly?: boolean;
  styles?: any;
}



export function AsyncMultiSelect({
  label,
  placeholder = "Select...",
  value,
  onChange,
  className,
  data,
  mapToOption,
  pageSize = 50,
  debounceTimeout = 300,
  isDisabled = false,
  isClearable = true,
  showCodeOnly = false,
  styles: customStyles
}: AsyncMultiSelectProps) {
  const [options, setOptions] = useState<AsyncSelectOption[]>([]);
  const [cache, setCache] = useState<Map<string, AsyncSelectOption[]>>(new Map());

  // Transform data to options when data changes
  React.useEffect(() => {
    if (data && data.length) {
      const transformedOptions = data.map(mapToOption);
      setOptions(transformedOptions);
      // Clear cache when data changes
      setCache(new Map());
    } else {
      setOptions([]);
      setCache(new Map());
    }
  }, [data, mapToOption]);

  const loadOptions = useCallback(
    async (
      search: string,
      loadedOptions: OptionsOrGroups<AsyncSelectOption, GroupBase<AsyncSelectOption>>,
      additional?: { page: number }
    ) => {
      const cacheKey = search.toLowerCase();
      
      // Check cache first
      if (cache.has(cacheKey)) {
        const cachedOptions = cache.get(cacheKey)!;
        const page = additional?.page ?? 1;
        const offset = (page - 1) * pageSize;
        const nextOptions = cachedOptions.slice(offset, offset + pageSize);
        const hasMore = offset + pageSize < cachedOptions.length;
        
        return {
          options: nextOptions,
          hasMore,
          additional: { page: page + 1 },
        };
      }

      // Filter options based on search
      let filteredOptions = options;
      if (search) {
        filteredOptions = options.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase()) ||
          opt.value.toString().toLowerCase().includes(search.toLowerCase())
        );
      }

      // Cache the filtered results
      setCache(prev => new Map(prev.set(cacheKey, filteredOptions)));

      const page = additional?.page ?? 1;
      const offset = (page - 1) * pageSize;
      const nextOptions = filteredOptions.slice(offset, offset + pageSize);
      const hasMore = offset + pageSize < filteredOptions.length;

      return {
        options: nextOptions,
        hasMore,
        additional: { page: page + 1 },
      };
    },
    [options, pageSize, cache]
  );

  // Custom components for code display
  const customComponents = useMemo(() => {
    if (!showCodeOnly) return undefined;
    
    return {
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

  // Styles to match existing MultiSelect styling
  const styles = useMemo(() => ({
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '32px',
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
      zIndex: 9999,
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: '2px'
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
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999
    })
  }), []);

  return (
    <div className={className}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {label}
        </Label>
      )}
      <AsyncPaginate<AsyncSelectOption, GroupBase<AsyncSelectOption>, { page: number }>
        isMulti={true as any}
        value={value}
        loadOptions={loadOptions}
        onChange={(newValue) => {
          if (Array.isArray(newValue)) {
            onChange(newValue);
          } else {
            onChange([]);
          }
        }}
        additional={{ page: 1 }}
        debounceTimeout={debounceTimeout}
        placeholder={placeholder}
        isClearable={isClearable}
        isDisabled={isDisabled}
        components={customComponents}
        styles={customStyles ? { ...styles, ...customStyles } : styles}
        className="text-sm"
        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
        menuPosition="fixed"
      />
    </div>
  );
} 