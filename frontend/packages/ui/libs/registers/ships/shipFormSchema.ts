import { z } from 'zod';

// IMO validation function - checks if the IMO number follows international standards
const validateIMO = (imo: number): boolean => {
  // IMO number must be exactly 7 digits
  const imoString = imo.toString();
  if (imoString.length !== 7) {
    return false;
  }
  
  // Check if all characters are digits
  if (!/^\d{7}$/.test(imoString)) {
    return false;
  }
  
  return true;
};

// Base vessel grade schema
const vesselGradeSchema = z.object({
  id: z.number().optional(),
  vesselId: z.number().min(1, 'Vessel ID is required'),
  gradeId: z.number().min(1, 'Grade ID is required'),
  uomId: z.number().min(1, 'Unit of measure ID is required'),
  type: z.string().min(1, 'Type is required').default('primary'),
});

// Speed consumption item schema
const speedConsumptionItemSchema = z.object({
  id: z.number().min(1, 'ID is required'),
  speed: z.string().min(1, 'Speed is required'),
  mode: z.enum(['ballast', 'laden', 'port'], 'Mode must be ballast, laden, or port'),
  consumptions: z.record(z.string(), z.string().min(1, 'Consumption value is required')),
});

// Vessel JSON schema for speed consumptions
const vesselJsonSchema = z.object({
  speedConsumptions: z.array(speedConsumptionItemSchema).optional(),
}).optional();

// Main vessel schema
const vesselSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Required').max(100, 'Vessel name must be 100 characters or less'),
  code: z.string().min(1, 'Required').max(50, 'Vessel code must be 50 characters or less'),
  dwt: z.number().min(1, 'Required'),
  type: z.number().min(1, 'Required'),
  runningCost: z.number().min(1, 'Required'),
  imo: z.number()
    .min(1, 'Required')
    .refine(validateIMO, 'IMO number must be exactly 7 digits'),
  vesselJson: z.string().optional(),
  vesselGrades: z.array(vesselGradeSchema).default([]),
});

// Create ship request schema
const createShipRequestSchema = z.object({
  name: z.string().min(1, 'Required').max(100, 'Vessel name must be 100 characters or less'),
  code: z.string().min(1, 'Required').max(50, 'Vessel code must be 50 characters or less'),
  imo: z.number()
    .min(1, 'Required')
    .refine(validateIMO, 'IMO number must be exactly 7 digits'),
  type: z.number().min(1, 'Required'),
  dwt: z.number().min(1, 'Required'),
  runningCost: z.number().min(1, 'Required'),
});

// Update ship request schema
const updateShipRequestSchema = createShipRequestSchema.partial().extend({
  id: z.number().min(1, 'Vessel ID is required'),
});

// Export all schemas
export {
  vesselGradeSchema,
  speedConsumptionItemSchema,
  vesselJsonSchema,
  vesselSchema,
  createShipRequestSchema,
  updateShipRequestSchema,
}
