ALTER TABLE subscription_payments RENAME COLUMN amount_inr TO amount;
ALTER TABLE subscription_payments ADD COLUMN currency VARCHAR(10) DEFAULT 'INR';
