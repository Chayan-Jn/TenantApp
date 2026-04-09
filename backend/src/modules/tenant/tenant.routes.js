import { Router } from 'express'
import { createTenant, getTenants, removeTenant,getTenantById } from './tenant.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { createTenantSchema } from './tenant.schema.js'

const router = Router()

router.use(protect)


router.post('/', validate(createTenantSchema), createTenant)
router.get('/', getTenants)
router.get('/:id', getTenantById)
router.delete('/:id', removeTenant)

export default router