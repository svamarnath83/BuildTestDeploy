import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getOptionAndName<T extends Record<string, any>>(
  code: string | number | undefined,
  data: T[],
  codeKey: keyof T,
  nameKey: keyof T
) {
  if (!code) return { option: null, name: '' };
  const found = data.find(item => String(item[codeKey]) === String(code));
  if (found) {
    const value = found[codeKey];
    const label = `${found[codeKey]} - ${found[nameKey]}`;
    const name = found[nameKey] as string;
    return {
      option: { value: value as string | number, label },
      name
    };
  }
  return { option: null, name: '' };
}