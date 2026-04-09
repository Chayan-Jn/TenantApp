import { Router } from 'express'
import { getPayments } from './payments.controller.js'
import { protect } from '../auth/auth.middleware.js'

const router = Router()

router.use(protect)
router.get('/', getPayments)

export default router