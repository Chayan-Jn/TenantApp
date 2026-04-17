CREATE TABLE unit_photos (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  file_key TEXT NOT NULL,
  label TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
