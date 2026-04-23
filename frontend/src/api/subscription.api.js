import { api } from './client.js'

/**
 * Gets the current owner's subscription status.
 */
export const getSubscriptionStatus = () => api('/subscription/status')

/**
 * Gets the owner's full subscription purchase history.
 */
export const getSubscriptionHistory = () => api('/subscription/history')

/**
 * Creates a Razorpay subscription order (backend side).
 */
export const createSubscription = (planId) => {
  return api('/subscription/create-order', {
    method: 'POST',
    body: { planId }
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
