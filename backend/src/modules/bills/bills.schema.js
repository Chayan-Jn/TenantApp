import { z } from 'zod'

export const createBillSchema = z.object({
  unit_id: z.number().int(),
  type: z.enum(['electricity', 'water', 'gas', 'maintenance', 'parking', 'other']),
  amount: z.number().int().min(1),
  split_type: z.enum(['unit', 'equal', 'custom']),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
  note: z.string().max(255).optional(),
  splits: z.array(z.object({
    tenant_id: z.number().int(),
    amount: z.number().int().min(1)
  })).optional()
})

export const updateBillSchema = z.object({
  type: z.enum(['electricity', 'water', 'gas', 'maintenance', 'parking', 'other']),
  amount: z.number().int().min(1),
  split_type: z.enum(['unit', 'equal', 'custom']),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
  note: z.string().max(255).optional(),
  splits: z.array(z.object({
    tenant_id: z.number().int(),
    amount: z.number().int().min(1)
  })).optional()
})