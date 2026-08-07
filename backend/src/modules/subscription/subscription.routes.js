import express from 'express';
import { protect } from '../auth/auth.middleware.js';
import * as subscriptionController from './subscription.controller.js';

const router = express.Router();

router.use(protect);


router.get('/status', subscriptionController.getStatus);
router.get('/history', subscriptionController.getHistory);
router.post('/create-order', subscriptionController.createOrder);
router.post('/verify', subscriptionController.verifyPayment);

// PayPal Routes
router.get('/paypal-config', subscriptionController.getPaypalConfig);
router.post('/paypal/order', subscriptionController.createPaypalOrder);
router.post('/paypal/verify', subscriptionController.verifyPaypalPayment);

export default router;
