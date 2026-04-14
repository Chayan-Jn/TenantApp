ALTER TABLE rent_payments
ALTER COLUMN status DROP DEFAULT,
ALTER COLUMN status TYPE payment_status USING status::payment_status,
ALTER COLUMN status SET DEFAULT 'pending';
