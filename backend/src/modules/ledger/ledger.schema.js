import { z } from 'zod'

export const getLedgerSchema = z.object({
  
  property_id: z.union([z.number(), z.string()]), 
  
  month: z.union([
    z.number().min(1).max(12), 
    z.literal('all')
  ]),
  
  year: z.number().min(2000)
})