
import { Router } from 'express'
import { 
  createBill, getBills, getBillSplits, 
  deleteBill, updateBill, 
  updateBillStatus, updateSplitStatus 
} from './bills.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { validateId } from '../../middlewares/validateId.middleware.js'
import { createBillSchema, updateBillSchema } from './bills.schema.js'

const router = Router()

router.use(protect)

router.post('/', validate(createBillSchema), createBill)
router.get('/', getBills)

router.patch('/splits/:id/status', validateId('id'), updateSplitStatus)

router.get('/:id/splits', validateId('id'), getBillSplits)
router.delete('/:id', validateId('id'), deleteBill)
router.patch('/:id', validateId('id'), validate(updateBillSchema), updateBill)
router.patch('/:id/status', validateId('id'), updateBillStatus)

export default router