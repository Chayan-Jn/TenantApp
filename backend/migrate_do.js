import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';

const connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL.split('?')[0] : '';

const client = new pg.Pool({
  connectionString,
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false
    }
  })
});

const sql = fs.readFileSync('db/migrations/014_add_subscription_to_owners.sql', 'utf8');

client.query(sql).then(() => {
  console.log("Migration successful!");
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
