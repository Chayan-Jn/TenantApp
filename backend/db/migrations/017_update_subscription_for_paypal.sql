ALTER TABLE subscription_payments ALTER COLUMN razorpay_order_id DROP NOT NULL;
ALTER TABLE subscription_payments ALTER COLUMN razorpay_payment_id DROP NOT NULL;
ALTER TABLE subscription_payments ADD COLUMN payment_gateway VARCHAR(50) DEFAULT 'razorpay';
ALTER TABLE subscription_payments ADD COLUMN paypal_order_id VARCHAR(100) UNIQUE;
ALTER TABLE subscription_payments ADD COLUMN paypal_capture_id VARCHAR(100) UNIQUE;
