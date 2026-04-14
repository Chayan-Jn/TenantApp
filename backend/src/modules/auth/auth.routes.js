import { Router } from 'express'
import { register, login, logout, googleLogin } from './auth.controller.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { registerSchema, loginSchema, googleSchema } from './auth.schema.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', logout)
router.post('/google', validate(googleSchema), googleLogin)

export default router