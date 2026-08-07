import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    planId: z.enum(['plan_monthly', 'plan_annual'], {
      required_error: 'Plan ID is required',
    }),
    currency: z.enum(['INR', 'USD']).default('INR'),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string({ required_error: 'Order ID is required' }),
    razorpay_payment_id: z.string({ required_error: 'Payment ID is required' }),
    razorpay_signature: z.string({ required_error: 'Signature is required' }),
    planId: z.enum(['plan_monthly', 'plan_annual'], {
      required_error: 'Plan ID is required',
    }),
    currency: z.enum(['INR', 'USD']).default('INR'),
  }),
});

export const createPaypalOrderSchema = z.object({
  body: z.object({
    planId: z.enum(['plan_monthly', 'plan_annual'], {
      required_error: 'Plan ID is required',
    }),
  }),
});

export const verifyPaypalPaymentSchema = z.object({
  body: z.object({
    paypalOrderId: z.string({ required_error: 'PayPal Order ID is required' }),
    planId: z.enum(['plan_monthly', 'plan_annual'], {
      required_error: 'Plan ID is required',
    }),
  }),
});
