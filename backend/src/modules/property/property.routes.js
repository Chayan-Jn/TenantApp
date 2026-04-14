import { Router } from 'express'
import { createProperty, getProperties,deleteProperty,updateProperty,getPropertyById } from './property.controller.js'
import { protect } from '../auth/auth.middleware.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { validateId } from '../../middlewares/validateId.middleware.js'
import { createPropertySchema, updatePropertySchema } from './property.schema.js'


const router = Router()

router.use(protect)


router.post('/', validate(createPropertySchema), createProperty)
router.get('/', getProperties)
router.delete('/:id', validateId('id'), deleteProperty)
router.patch('/:id', validateId('id'), validate(updatePropertySchema), updateProperty)
router.get('/:id', validateId('id'), getPropertyById)

export default router