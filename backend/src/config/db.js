import pg from 'pg';
import path from 'path';
import fs from 'fs';
const { Pool } = pg;
import { env } from './env.js';

const certPath = path.resolve(process.cwd(), 'certs/ca-certificate.crt');
let caCertString = '';

// 1. Handle the CA_CERT properly
if (env.CA_CERT) {
  // Replace escaped newlines if they exist, otherwise use as is
  caCertString = env.CA_CERT.replace(/\\n/g, '\n');
} else if (fs.existsSync(certPath)) {
  caCertString = fs.readFileSync(certPath).toString();
}

// 2. Clean the Connection String
// DigitalOcean's injected URL often has ?sslmode=require. 
// We strip it so the 'ssl' object below takes full control.
const connectionString = env.DATABASE_URL ? env.DATABASE_URL.split('?')[0] : '';

const pool = new Pool({
  connectionString: connectionString,
  max: 12, 
  connectionTimeoutMillis: 5000, 
  ssl: {
    rejectUnauthorized: true,
    ca: caCertString,
    // Forces the handshake to match the DB hostname—fixes 'Self-signed' errors in pools
    servername: connectionString ? new URL(connectionString).hostname : undefined
  }
});

export const connectToDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('DB connected successfully via Pool');
  } catch (err) {
    console.error('Error connecting to db:', err.message);
    throw err;
  }
};

export default pool;