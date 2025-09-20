import { z } from 'zod';

export const accountGroupSchema = z.object({
  groupCode: z.string()
    .min(1, 'Group code is required')
    .max(10, 'Group code must be 10 characters or less'),
  description: z.string()
    .min(1, 'Description is required')
    .max(100, 'Description must be 100 characters or less'),
  level1Name: z.string()
    .max(50, 'Level 1 name must be 50 characters or less')
    .optional(),
  level1Code: z.string()
    .max(10, 'Level 1 code must be 10 characters or less')
    .optional(),
  level2Name: z.string()
    .max(50, 'Level 2 name must be 50 characters or less')
    .optional(),
  level2Code: z.string()
    .max(10, 'Level 2 code must be 10 characters or less')
    .optional(),
  level3Name: z.string()
    .max(50, 'Level 3 name must be 50 characters or less')
    .optional(),
  level3Code: z.string()
    .max(10, 'Level 3 code must be 10 characters or less')
    .optional(),
  ifrsReference: z.string()
    .max(50, 'IFRS reference must be 50 characters or less')
    .optional(),
  saftCode: z.string()
    .max(50, 'SAFT code must be 50 characters or less')
    .optional(),
});

export type AccountGroupFormData = z.infer<typeof accountGroupSchema>;
