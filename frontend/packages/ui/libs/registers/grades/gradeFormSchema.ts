import { z } from 'zod';

export const gradeFormSchema = z.object({
  name: z.string().min(1, 'Required'),
  price: z.number().min(0, 'Price must be non-negative'),
}); 