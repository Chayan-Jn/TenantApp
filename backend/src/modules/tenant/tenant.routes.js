import { Router } from 'express'
import { createTenant, getTenants, removeTenant } from './tenant.controller.js'
import { protect } from '../auth/auth.middleware.js'

const router = Router()

router.use(protect)

router.post('/', createTenant)
router.get('/', getTenants)
router.delete('/:id', removeTenant)

export default router