import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';

const caCert = process.env.CA_CERT ? process.env.CA_CERT.replace(/\\n/g, '\n') : undefined;
const connectionString = process.env.DATABASE_URL.split('?')[0];

const client = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: true,
    ca: caCert,
    servername: new URL(connectionString).hostname
  }
});

const sql = fs.readFileSync('db/migrations/014_add_subscription_to_owners.sql', 'utf8');

client.query(sql).then(() => {
  console.log("Migration successful!");
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
