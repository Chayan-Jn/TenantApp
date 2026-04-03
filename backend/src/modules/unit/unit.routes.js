import { Router } from 'express'
import { createUnit, getUnits, deleteUnit } from './unit.controller.js'
import { protect } from '../auth/auth.middleware.js'

const router = Router()

router.use(protect)

router.post('/', createUnit)
router.get('/', getUnits)
router.delete('/:id', deleteUnit)

export default router