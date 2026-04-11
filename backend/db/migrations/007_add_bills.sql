CREATE TYPE bill_type AS ENUM ('electricity', 'water', 'gas', 'maintenance', 'parking', 'other');
CREATE TYPE bill_split_type AS ENUM ('unit', 'equal', 'custom');

CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  type bill_type NOT NULL,
  amount INTEGER NOT NULL,
  split_type bill_split_type NOT NULL DEFAULT 'unit',
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bill_splits (
  id SERIAL PRIMARY KEY,
  bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL
);