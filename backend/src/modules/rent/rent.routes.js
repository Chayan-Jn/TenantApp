import { Router } from 'express'
import { createRentRecord, getRentByTenant, markRentPaid, getOverdueRents,markRentUnpaid } from './rent.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { createRentSchema } from './rent.schema.js'


const router = Router()

router.use(protect)

router.post('/', validate(createRentSchema), createRentRecord)
router.get('/', getRentByTenant)
router.patch('/:id/pay', markRentPaid)
router.get('/overdue', getOverdueRents)
router.patch('/:id/unpay', markRentUnpaid)

export default router