ALTER TABLE rent_payments ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20) DEFAULT 'rent';
