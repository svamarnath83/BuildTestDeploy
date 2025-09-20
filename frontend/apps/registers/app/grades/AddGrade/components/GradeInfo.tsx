'use client';

import React from "react";
import { Input, Checkbox, Label, FormItem, labelText, valueText } from '@commercialapp/ui';
import { Grade } from '@commercialapp/ui';

interface GradeInfoProps {
  form: Grade;
  errors: { [key: string]: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | boolean) => void;
}

export default function GradeInfo({ form, errors, handleChange }: GradeInfoProps) {
  return (
    <div className="mb-6 p-4 border border-[#e6eaf0] rounded-[4px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-w-4xl">
        {/* Grade Name */}
        <FormItem>
          <div className="flex items-center gap-2">
            <Label htmlFor="name" className={`${labelText} ${errors.name ? 'text-[#ff0000]' : ''}`}>Grade Name</Label>
            {errors.name && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.name}</small>}
          </div>
          <Input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter grade name"
            required
            className={valueText}
          />
        </FormItem>

        {/* Price */}
        <FormItem>
          <div className="flex items-center gap-2">
            <Label htmlFor="price" className={`${labelText} ${errors.price ? 'text-[#ff0000]' : ''}`}>Price</Label>
            {errors.price && <small className="text-[#ff0000] text-[10px] mx-auto">{errors.price}</small>}
          </div>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price ?? 0}
            onChange={handleChange}
            placeholder="Enter price"
            required
            className={valueText}
          />
        </FormItem>

        {/* In Use Checkbox */}
        <FormItem>
          <Label className={labelText}>Status</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Checkbox
              id="inUse"
              name="inUse"
              checked={form.inUse}
              onCheckedChange={(checked) => {
                const event = {
                  target: {
                    name: 'inUse',
                    type: 'checkbox',
                    checked: checked as boolean
                  }
                } as any;
                handleChange(event);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="inUse" className="text-sm font-medium">In Use</Label>
          </div>
        </FormItem>
      </div>
    </div>
  );
} 