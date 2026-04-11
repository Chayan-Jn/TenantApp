
import { Router } from 'express'
import { 
  createBill, getBills, getBillSplits, 
  deleteBill, updateBill, 
  updateBillStatus, updateSplitStatus 
} from './bills.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { createBillSchema } from './bills.schema.js'

const router = Router()

router.use(protect)

router.post('/', validate(createBillSchema), createBill)
router.get('/', getBills)

router.patch('/splits/:id/status', updateSplitStatus)

router.get('/:id/splits', getBillSplits)
router.delete('/:id', deleteBill)
router.patch('/:id', updateBill)
router.patch('/:id/status', updateBillStatus)

export default router