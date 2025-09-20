import React from "react";
import { AsyncSelect, labelText, Option } from "@commercialapp/ui";

interface DropdownFieldProps {
  value: Option | null;
  data: any[];
  mapToOption: (item: any) => Option;
  onChange: (option: Option | null) => void;
  error?: string;
  placeholder?: string;
  pageSize?: number;
  className?: string;
  controlMinHeight?: number;
}

export function DropdownField({
  
  value,
  data,
  mapToOption,
  onChange,
  error,
  placeholder = "Select...",
  pageSize = 10,
  className,
  controlMinHeight,
}: DropdownFieldProps) {
  return (
   
      <AsyncSelect
        data={data}
        mapToOption={mapToOption}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        pageSize={pageSize}
        debounceTimeout={300}
        className={className}
        controlMinHeight={controlMinHeight}
      />
    
  );
} 