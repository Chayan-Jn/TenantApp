import express from 'express';
import { protect } from '../auth/auth.middleware.js';
import * as subscriptionController from './subscription.controller.js';

const router = express.Router();

router.use(protect);


router.get('/status', subscriptionController.getStatus);
router.post('/create-order', subscriptionController.createOrder);
router.post('/verify', subscriptionController.verifyPayment);

export default router;
