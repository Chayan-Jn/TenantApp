import { Router } from 'express'
import { createRentRecord, getRentByTenant, markRentPaid, getOverdueRents,markRentUnpaid,generateMonthlyRent } from './rent.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { validateId } from '../../middlewares/validateId.middleware.js'
import { createRentSchema, generateRentSchema } from './rent.schema.js'


const router = Router()

router.use(protect)

router.post('/', validate(createRentSchema), createRentRecord)
router.get('/', getRentByTenant)
router.patch('/:id/pay', validateId('id'), markRentPaid)
router.get('/overdue', getOverdueRents)
router.patch('/:id/unpay', validateId('id'), markRentUnpaid)
router.post('/generate', validate(generateRentSchema), generateMonthlyRent)

export default router