CREATE TYPE payment_status AS ENUM ('pending', 'paid');

ALTER TABLE bills 
ADD COLUMN status payment_status NOT NULL DEFAULT 'pending';

ALTER TABLE bill_splits 
ADD COLUMN status payment_status NOT NULL DEFAULT 'pending';