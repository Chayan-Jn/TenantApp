import * as subscriptionService from './subscription.service.js';
import { createOrderSchema, verifyPaymentSchema, createPaypalOrderSchema, verifyPaypalPaymentSchema } from './subscription.schema.js';

export const getStatus = async (req, res) => {
  try {
    const status = await subscriptionService.getSubscriptionStatus(req.owner.id);
    res.status(200).json({ success: true, data: status });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const parsed = createOrderSchema.parse({ body: req.body });
    const order = await subscriptionService.createOrder(parsed.body.planId, parsed.body.currency);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const parsed = verifyPaymentSchema.parse({ body: req.body });
    const result = await subscriptionService.verifyPayment(req.owner.id, parsed.body);
    res.status(200).json({ success: true, data: result, message: 'Payment verified and subscription activated.' });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await subscriptionService.getPaymentHistory(req.owner.id);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getPaypalConfig = (req, res) => {
  try {
    const clientId = subscriptionService.getPaypalClientId();
    res.status(200).json({ success: true, data: { clientId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createPaypalOrder = async (req, res) => {
  try {
    const parsed = createPaypalOrderSchema.parse({ body: req.body });
    const order = await subscriptionService.createPaypalOrder(parsed.body.planId);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

export const verifyPaypalPayment = async (req, res) => {
  try {
    const parsed = verifyPaypalPaymentSchema.parse({ body: req.body });
    const result = await subscriptionService.verifyPaypalPayment(req.owner.id, parsed.body);
    res.status(200).json({ success: true, data: result, message: 'PayPal payment verified.' });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: err.errors });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};
