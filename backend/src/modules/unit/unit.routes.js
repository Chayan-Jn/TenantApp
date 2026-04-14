import { Router } from 'express'
import { createUnit, getUnits, deleteUnit,updateUnit,getUnitById } from './unit.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { validateId } from '../../middlewares/validateId.middleware.js'
import { createUnitSchema, updateUnitSchema } from './unit.schema.js'

const router = Router()

router.use(protect)

router.post('/', validate(createUnitSchema), createUnit)
router.get('/', getUnits)
router.delete('/:id', validateId('id'), deleteUnit)
router.patch('/:id', validateId('id'), validate(updateUnitSchema), updateUnit)
router.get('/:id', validateId('id'), getUnitById)


export default router