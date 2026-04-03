import { Router } from 'express'
import { createProperty, getProperties,deleteProperty } from './property.controller.js'
import { protect } from '../auth/auth.middleware.js'

const router = Router()

router.use(protect)

router.post('/', createProperty)
router.get('/', getProperties)
router.delete('/:id', deleteProperty)

export default router