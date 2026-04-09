import { Router } from 'express'
import { getDashboardStats } from './dashboard.controller.js'
import { protect } from '../auth/auth.middleware.js'

const router = Router()

router.use(protect)
router.get('/stats', getDashboardStats)

export default router