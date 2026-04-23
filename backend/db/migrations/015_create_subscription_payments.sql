CREATE TABLE IF NOT EXISTS subscription_payments (
  id            SERIAL PRIMARY KEY,
  owner_id      INTEGER NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  razorpay_order_id   VARCHAR(100) NOT NULL,
  razorpay_payment_id VARCHAR(100) NOT NULL UNIQUE,
  plan          VARCHAR(50)  NOT NULL,
  amount_inr    INTEGER      NOT NULL,
  paid_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_payments_owner ON subscription_payments(owner_id);
