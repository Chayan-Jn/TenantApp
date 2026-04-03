import { Router } from 'express'
import { register, login,logout } from './auth.controller.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { registerSchema, loginSchema } from './auth.schema.js'


const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)


export default router