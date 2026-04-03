CREATE TYPE property_type AS ENUM ('flat', 'pg', 'commercial');

CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  type property_type NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);