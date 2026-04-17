import { z } from 'zod'

export const createRentSchema = z.object({
  tenant_id: z.number().int(),
  amount: z.number().int().min(0),
  due_date: z.string().date()
})

export const generateRentSchema = z.object({
  property_id: z.union([z.coerce.number().int(), z.literal('all')]),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000)
})

export const updateRentSchema = z.object({
  amount: z.number().int().min(0).optional(),
  due_date: z.string().date().optional()
})
