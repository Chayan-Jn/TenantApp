import { Router } from 'express'
import { getMe, updateMe, updatePassword } from './owner.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { updateOwnerSchema, updatePasswordSchema } from './owner.schema.js'

const router = Router()

router.use(protect)

router.get('/me', getMe)
router.patch('/me', validate(updateOwnerSchema), updateMe)
router.patch('/me/password', validate(updatePasswordSchema), updatePassword)

export default router