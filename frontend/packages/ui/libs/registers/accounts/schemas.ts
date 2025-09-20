import { z } from 'zod';

const levelCode = z.string().max(10).optional();
const name50 = z.string().max(50).optional();

export const createAccountGroupSchema = z.object({
  level1_name: name50,
  level1_code: levelCode,
  level2_name: name50,
  level2_code: levelCode,
  level3_name: name50,
  level3_code: levelCode,
  group_code: z.string().min(1).max(10),
  description: z.string().max(100).optional(),
  ifrs_reference: z.string().max(50).optional(),
  saft_code: z.string().max(50).optional(),
});

export const updateAccountGroupSchema = createAccountGroupSchema.partial().extend({ id: z.number().min(1) });

export const createAccountSchema = z.object({
  account_number: z.string().min(1).max(20),
  account_name: z.string().min(1).max(100),
  external_account_number: z.string().max(50).optional(),
  ledger_type: z.string().max(20).optional(),
  dimension: z.string().max(50).optional(),
  currency: z.string().max(10).optional(),
  currency_code: z.string().max(10).optional(),
  status: z.string().optional().default('Free'),
  type: z.string().max(20).optional(),
  account_group_id: z.number().optional(),
});

export const updateAccountSchema = createAccountSchema.partial().extend({ id: z.number().min(1) });

export type CreateAccount = z.infer<typeof createAccountSchema>;
export type CreateAccountGroup = z.infer<typeof createAccountGroupSchema>;
