import { Router } from 'express'
import { createTenant, getTenants, removeTenant,getTenantById,updateTenant } from './tenant.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { validateId } from '../../middlewares/validateId.middleware.js'
import { createTenantSchema, updateTenantSchema, removeTenantSchema } from './tenant.schema.js'

const router = Router()

router.use(protect)


router.post('/', validate(createTenantSchema), createTenant)
router.get('/', getTenants)
router.get('/:id', validateId('id'), getTenantById)
router.delete('/:id', validateId('id'), validate(removeTenantSchema), removeTenant)
router.patch('/:id', validateId('id'), validate(updateTenantSchema), updateTenant)

export default router