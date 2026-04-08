import { z } from 'zod'

export const createPropertySchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  type: z.enum(['flat', 'pg', 'commercial'])
})
