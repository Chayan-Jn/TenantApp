import pg from 'pg';
import path from 'path';
import fs from 'fs';
const { Pool } = pg;
import { env } from './env.js';

const certPath = path.resolve(process.cwd(), 'certs/ca-certificate.crt');
let caCertString = '';
if (env.CA_CERT && env.CA_CERT.includes('BEGIN CERTIFICATE')) {
  caCertString = env.CA_CERT.replace(/\\n/g, '\n');
} else if (fs.existsSync(certPath)) {
  caCertString = fs.readFileSync(certPath).toString();
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 12, 
  connectionTimeoutMillis: 5000, 
  
  ssl: {
    rejectUnauthorized: true,
    ca: caCertString
  }
});

export const connectToDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('DB connected successfully via Pool');
  } catch (err) {
    console.error('Error connecting to db', err);
    throw err;
  }
};

export default pool;