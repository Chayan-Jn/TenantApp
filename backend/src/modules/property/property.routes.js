import { Router } from 'express'
import { createProperty, getProperties,deleteProperty } from './property.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { createPropertySchema } from './property.schema.js'


const router = Router()

router.use(protect)


router.post('/', validate(createPropertySchema), createProperty)
router.get('/', getProperties)
router.delete('/:id', deleteProperty)

export default router