import { z } from 'zod'

export const createPropertySchema = z.object({
  name: z.string().min(1).max(50),
  address: z.string().min(1).max(200),
  type: z.enum(['flat', 'pg', 'commercial'])
})

export const updatePropertySchema = createPropertySchema
