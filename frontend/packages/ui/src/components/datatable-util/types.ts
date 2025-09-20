import React from 'react';

export type ColumnMeta<T> = {
  key: keyof T;
  title: string;
  isNumeric?: boolean;
  isOptional?: boolean;
  isBoolean?: boolean;
  customCell?: (value: any, row?: any) => React.ReactNode;
};