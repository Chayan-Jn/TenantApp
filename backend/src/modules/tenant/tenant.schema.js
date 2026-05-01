import { z } from 'zod'

export const createTenantSchema = z.object({
  unit_id: z.number().int(),
  name: z.string().min(2).max(50),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Phone must be a 10 digit number' }),
  join_date: z.string().date(),
  security_deposit: z.number().int().min(0).optional().default(0),
  notice_period_days: z.number().int().min(0).max(365).optional().default(0),
  rent_due_day: z.number().int().min(1).max(31).optional()
})

export const updateTenantSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Phone must be a 10 digit number' }).optional(),
  rent_due_day: z.number().int().min(1).max(31).nullable().optional(),
  expected_move_out: z.string().date().optional(),
  notice_period_days: z.number().int().min(0).max(365).optional()
})

export const removeTenantSchema = z.object({
  deposit_refunded: z.coerce.number().min(0).optional().default(0),
  deposit_note: z.string().max(255).optional().default(''),
  leave_date: z.string().date().optional()
})

export const giveNoticeSchema = z.object({
  expected_move_out: z.string().date().optional()
})
