ALTER TABLE owners ADD COLUMN subscription_plan VARCHAR(50) DEFAULT 'free';
ALTER TABLE owners ADD COLUMN subscription_status VARCHAR(50) DEFAULT 'active';
ALTER TABLE owners ADD COLUMN subscription_end_date TIMESTAMP WITH TIME ZONE;
