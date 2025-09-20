import { z } from 'zod';

export const cargoFormSchema = z.object({
  commodity: z.string().min(1, { message: 'Required' }),
  
  quantity: z.number().min(0.01, { message: 'Required' }),
  
  quantityType: z.string().min(1, { message: 'Required' }),
  
  currency: z.string().min(1, { message: 'Required' }),
  
  rate: z.number().min(0.01, { message: 'Required' }),
  
  rateType: z.string().min(1, { message: 'Required' }),
  
  loadPorts: z.array(z.string()).min(1, { 
    message: 'Required' 
  }),
  
  dischargePorts: z.array(z.string()).min(1, { 
    message: 'Required' 
  }),
  
  laycanFrom: z.string().min(1, { message: 'Required' }),
  
  laycanTo: z.string().min(1, { message: 'Required' })
});

export type CargoFormData = z.infer<typeof cargoFormSchema>;

// Partial schema for individual field validation
export const cargoFormPartialSchema = cargoFormSchema.partial();

// Schema for validating individual fields
export const commoditySchema = cargoFormSchema.pick({ commodity: true });
export const quantitySchema = cargoFormSchema.pick({ quantity: true });
export const quantityTypeSchema = cargoFormSchema.pick({ quantityType: true });
export const currencySchema = cargoFormSchema.pick({ currency: true });
export const rateSchema = cargoFormSchema.pick({ rate: true });
export const rateTypeSchema = cargoFormSchema.pick({ rateType: true });
export const loadPortsSchema = cargoFormSchema.pick({ loadPorts: true });
export const dischargePortsSchema = cargoFormSchema.pick({ dischargePorts: true });
export const laycanFromSchema = cargoFormSchema.pick({ laycanFrom: true });
export const laycanToSchema = cargoFormSchema.pick({ laycanTo: true }); 