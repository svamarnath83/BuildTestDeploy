import { z } from 'zod';

const emptyToUndefined = (val: string | undefined) => {
  if (val === undefined || val === null || val === "") return undefined;
  return val;
};

export const portFormSchema = z.object({
  Name: z.string().min(1, 'Port Name is required').max(100, 'Port Name must be 100 characters or less'),
  PortCode: z.string().min(1, 'Port Code is required').max(50, 'Port Code must be 50 characters or less'),
  portName: z.string().optional(),
  unctadCode: z.string().max(50, 'UNCTAD Code must be 50 characters or less').optional(),
  utc: z.union([z.number(), z.string().transform((val) => val === '' ? null : Number(val)), z.null()]).optional(),
  netpasCode: z.string().max(50, 'Netpas Code must be 50 characters or less').optional(),
  Latitude: z.preprocess(
    emptyToUndefined,
    z.string().optional().refine((val) => {
      // Allow empty or missing value
      if (!val || val.trim() === "") return true;
      // Validate latitude: -90 to 90 degrees
      const num = parseFloat(val);
      return !isNaN(num) && num >= -90 && num <= 90;
    }, { message: "Latitude must be between -90 and 90 degrees" })
  ),
  Longitude: z.preprocess(
    emptyToUndefined,
    z.string().optional().refine((val) => {
      // Allow empty or missing value
      if (!val || val.trim() === "") return true;
      // Validate longitude: -180 to 180 degrees
      const num = parseFloat(val);
      return !isNaN(num) && num >= -180 && num <= 180;
    }, { message: "Longitude must be between -180 and 180 degrees" })
  ),
  ecaType: z.enum(['china', 'med', 'seca', 'none']).optional(),
  ets: z.union([z.string(), z.boolean()]).optional(),
  IsActive: z.boolean().optional(),
  additionalData: z.string().optional(),
  country: z.number().min(1, 'Country is required'),
}); 