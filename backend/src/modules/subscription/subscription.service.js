import Razorpay from 'razorpay';
import crypto from 'crypto';
import pool from '../../config/db.js';
import { env } from '../../config/env.js';

let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance && env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

export const getSubscriptionStatus = async (ownerId) => {
  const result = await pool.query(
    'SELECT subscription_plan, subscription_status, subscription_end_date FROM owners WHERE id = $1',
    [ownerId]
  );
  if (!result.rows.length) throw new Error('Owner not found');
  
  const sub = result.rows[0];
  const now = new Date();
  const endDate = sub.subscription_end_date ? new Date(sub.subscription_end_date) : null;
  
  // Auto-expire if end date is passed
  let status = sub.subscription_status;
  if (endDate && now > endDate && status === 'active') {
    status = 'expired';
    await pool.query('UPDATE owners SET subscription_status = $1 WHERE id = $2', [status, ownerId]);
  }

  return {
    plan: sub.subscription_plan,
    status,
    endDate
  };
};

export const createOrder = async (planId, currency = 'INR') => {
  const rzp = getRazorpayInstance();
  if (!rzp) throw new Error('Razorpay is not configured on the server');

  let amount;
  if (currency === 'USD') {
    amount = planId === 'plan_monthly' ? 9.99 : 99.00;
  } else {
    amount = planId === 'plan_monthly' ? 199 : 1199;
  }
  
  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit (cents/paise)
    currency: currency,
    receipt: `receipt_${Date.now()}`
  };

  const order = await rzp.orders.create(options);
  // Return the order, but also attach the raw numeric amount for the frontend to know what was charged
  return { ...order, original_amount: amount };
};

export const verifyPayment = async (ownerId, paymentData) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, currency = 'INR' } = paymentData;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    throw new Error('Payment verification failed');
  }

  // Extend subscription based on the plan
  const extensionDays = planId === 'plan_monthly' ? 30 : 365;
  const planName = planId === 'plan_monthly' ? 'monthly' : 'annual';

  // We should extend from existing end_date if it's in the future and active, 
  // otherwise extend from today.
  const statusResult = await pool.query(
    'SELECT subscription_end_date, subscription_status FROM owners WHERE id = $1',
    [ownerId]
  );
  const currentSub = statusResult.rows[0];
  
  let baseDate = new Date();
  if (
    currentSub.subscription_status === 'active' && 
    currentSub.subscription_end_date && 
    new Date(currentSub.subscription_end_date) > baseDate
  ) {
    baseDate = new Date(currentSub.subscription_end_date);
  }

  const newEndDate = new Date(baseDate.getTime() + extensionDays * 24 * 60 * 60 * 1000);

  const updateResult = await pool.query(
    `UPDATE owners 
     SET subscription_plan = $1, subscription_status = 'active', subscription_end_date = $2 
     WHERE id = $3 RETURNING subscription_plan, subscription_status, subscription_end_date`,
    [planName, newEndDate, ownerId]
  );

  // Record the purchase in payment history
  let amount;
  if (currency === 'USD') {
    amount = planId === 'plan_monthly' ? 9.99 : 99.00;
  } else {
    amount = planId === 'plan_monthly' ? 199 : 1199;
  }

  await pool.query(
    `INSERT INTO subscription_payments (owner_id, razorpay_order_id, razorpay_payment_id, plan, amount, currency)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [ownerId, razorpay_order_id, razorpay_payment_id, planName, amount, currency]
  );

  return updateResult.rows[0];
};

export const getPaymentHistory = async (ownerId) => {
  const result = await pool.query(
    `SELECT id, razorpay_payment_id, plan, amount, currency, paid_at
     FROM subscription_payments
     WHERE owner_id = $1
     ORDER BY paid_at DESC`,
    [ownerId]
  );
  return result.rows;
};
