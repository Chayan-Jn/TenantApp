import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must have at least one uppercase, one lowercase, one number and one special character'
  })
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})
