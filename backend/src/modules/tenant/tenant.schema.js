import { z } from 'zod'

export const createTenantSchema = z.object({
  unit_id: z.number().int(),
  name: z.string().min(2),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Phone must be a 10 digit number' }),
  join_date: z.string().date(),
  security_deposit: z.number().int().min(0).optional().default(0)
})

export const updateTenantSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^[0-9]{10}$/, { message: 'Phone must be a 10 digit number' })
})
