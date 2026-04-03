import { z } from 'zod'

export const createUnitSchema = z.object({
  property_id: z.number().int(),
  label: z.string().min(1),
  rent: z.number().int().min(0)
})
