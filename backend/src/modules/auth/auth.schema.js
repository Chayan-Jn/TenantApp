import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscores'
  }),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must have at least one uppercase, one lowercase, one number and one special character'
  })
})

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

export const googleSchema = z.object({
  token: z.string().min(1, { message: 'Google token is required' })
})