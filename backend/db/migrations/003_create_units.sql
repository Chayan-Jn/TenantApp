CREATE TABLE units (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  label TEXT NOT NULL,         -- e.g. "Room 1", "Shop A", "Flat 3B"
  rent INTEGER NOT NULL,
  is_occupied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);