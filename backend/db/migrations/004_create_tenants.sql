CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  join_date DATE NOT NULL,
  leave_date DATE,             -- NULL means currently active
  created_at TIMESTAMP DEFAULT NOW()
);