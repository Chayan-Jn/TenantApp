import { Router } from 'express'
import { createUnit, getUnits, deleteUnit } from './unit.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { createUnitSchema } from './unit.schema.js'

const router = Router()

router.use(protect)

router.post('/', validate(createUnitSchema), createUnit)
router.get('/', getUnits)
router.delete('/:id', deleteUnit)


export default router