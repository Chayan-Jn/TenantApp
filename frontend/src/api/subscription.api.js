import { api } from './client.js'

/**
 * Gets the current owner's subscription status.
 */
export const getSubscriptionStatus = () => api('/subscription/status')

/**
 * Gets the owner's full subscription purchase history.
 */
export const getSubscriptionHistory = () => api('/subscription/history')

export const getPaypalConfig = () => api('/subscription/paypal-config')

export const createPaypalOrder = (planId) => {
  return api('/subscription/paypal/order', {
    method: 'POST',
    body: { planId }
  })
}

export const verifyPaypalPayment = (paypalOrderId, planId) => {
  return api('/subscription/paypal/verify', {
    method: 'POST',
    body: { paypalOrderId, planId }
  })
}

/**
 * Creates a Razorpay subscription order (backend side).
 */
export const createSubscription = (planId, currency = 'INR') => {
  return api('/subscription/create-order', {
    method: 'POST',
    body: { planId, currency }
  })
}

/**
 * Verifies the payment signature after a successful Razorpay checkout.
 */
export const verifyPayment = (paymentData) => {
  return api('/subscription/verify', {
    method: 'POST',
    body: paymentData
  })
}
