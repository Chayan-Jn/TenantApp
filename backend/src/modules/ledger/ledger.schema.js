import { z } from 'zod'

export const getLedgerSchema = z.object({
  
  property_id: z.union([z.coerce.number(), z.string()]), 
  
  month: z.union([
    z.coerce.number().min(1).max(12), 
    z.literal('all')
  ]),
  
  year: z.coerce.number().min(2000)
})