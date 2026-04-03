import { z } from 'zod'

export const createRentSchema = z.object({
  tenant_id: z.number().int(),
  amount: z.number().int().min(0),
  due_date: z.string().date()
})
