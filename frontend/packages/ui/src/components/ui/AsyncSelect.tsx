"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GroupBase, OptionsOrGroups } from "react-select";
import { selectText } from "../../classnames";

export interface Option {
  value: string | number;
  label: string;
}

interface AsyncSelectProps {
  data: any[];
  mapToOption: (item: any) => Option;
  pageSize?: number;
  placeholder?: string;
  value?: Option | null;
  onChange?: (value: Option | null) => void;
  debounceTimeout?: number;
  className?: string;
  controlMinHeight?: number; // px height for the control to align with sibling selects
}

function flattenOptions<OptionType>(
  options: OptionsOrGroups<OptionType, GroupBase<OptionType>>
): OptionType[] {
  if (
    Array.isArray(options) &&
    options.length > 0 &&
    typeof options[0] === "object" &&
    "options" in options[0]
  ) {
    // grouped options
    return options.flatMap((group: any) => group.options);
  }
  return options as OptionType[];
}

export function AsyncSelect({
    data,
    mapToOption,
    pageSize = 20,
    placeholder = "Select...",
    value,
    onChange,
    debounceTimeout = 300,
    className,
    controlMinHeight,
  }: AsyncSelectProps) {
    const [options, setOptions] = useState<Option[]>([]);
  
    useEffect(() => {
      if (data && data.length) {
        setOptions(data.map(mapToOption));
      } else {
        setOptions([]);
      }
    }, [data, mapToOption]);
  
    const loadOptions = useCallback(
        async (
          search: string,
          loadedOptions: OptionsOrGroups<Option, GroupBase<Option>>,
          additional?: { page: number }
        ) => {
          let flattened = options; // use local options state instead of loadedOptions
      
          if (search) {
            flattened = flattened.filter((opt) =>
              opt.label.toLowerCase().includes(search.toLowerCase())
            );
          }
      
          const page = additional?.page ?? 1;
          const offset = (page - 1) * pageSize;
          const nextOptions = flattened.slice(offset, offset + pageSize);
          const hasMore = offset + pageSize < flattened.length;
      
          return {
            options: nextOptions,
            hasMore,
            additional: { page: page + 1 },
          };
        },
        [options, pageSize]
      );
    // Styles to match existing MultiSelect styling
    const styles = useMemo(() => ({
      control: (base: any, state: any) => ({
        ...base,
        minWidth: '0',
        border: 'none',
        borderBottom: '1px solid #d1d5db',
        borderRadius: '0',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        ...(controlMinHeight ? { minHeight: `${controlMinHeight}px`, height: `${controlMinHeight}px` } : {}),
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
        fontSize: '12px',
        fontFamily: "'Segoe UI', 'Arial', sans-serif",
        color: '#3d4150',
        minWidth: '0',
      }),
      input: (base: any) => ({
        ...base,
        fontSize: '12px',
        fontFamily: "'Segoe UI', 'Arial', sans-serif",
        color: '#3d4150',
        margin: '0',
        padding: '0',
        minWidth: '0',
      }),
      placeholder: (base: any) => ({
        ...base,
        fontSize: '12px',
        fontFamily: "'Segoe UI', 'Arial', sans-serif",
        color: '#9ca3af'
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
        backgroundColor: state.isSelected ? '#e5e7eb' : 'white',
        color: '#374151',
        fontSize: '12px',
        fontFamily: "'Segoe UI', 'Arial', sans-serif",
        '&:hover': {
          backgroundColor: '#e5e7eb'
        },
        // Add checkmark for selected option
        '&::after': state.isSelected ? {
          content: '"✓"',
          position: 'absolute',
          right: '12px',
          color: 'white',
          fontWeight: 'bold'
        } : {}
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
    }), [controlMinHeight]);
    return (
      <AsyncPaginate<Option, GroupBase<Option>, { page: number }>
        value={value}
        loadOptions={loadOptions}
        onChange={onChange}
        additional={{ page: 1 }}
        debounceTimeout={debounceTimeout}
        placeholder={placeholder}
        styles={styles}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
        menuPosition="fixed"
        className={className ?? "w-48"}
      
      />
    );
  }