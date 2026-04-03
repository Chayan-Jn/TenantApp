import { z } from 'zod'

export const createPropertySchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  type: z.enum(['flat', 'pg', 'commercial'])
})
