import { z } from 'zod'

export const updateOwnerSchema = z.object({
    name: z.string().min(2)
  })

export const updatePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must have at least one uppercase, one lowercase, one number and one special character'
  })
})