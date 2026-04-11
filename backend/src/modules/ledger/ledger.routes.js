import { Router } from 'express'
import * as ledgerController from './ledger.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { getLedgerSchema } from './ledger.schema.js'

const router = Router()

router.post('/', protect, validate(getLedgerSchema), ledgerController.getLedger)

export default router