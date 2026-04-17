import pg from 'pg';
import path from 'path';
import fs from 'fs'
const { Pool } = pg;
import {env} from './env.js'

const certPath = path.resolve(process.cwd(), 'certs/ca-certificate.crt');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true, 
    ca: fs.readFileSync(certPath).toString() // Reading the digital ID badge
  }
});
export const connectToDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('DB connected successfully');
  } catch (err) {
    console.error('Error connecting to db', err);
    throw err;
  }
};

export default pool;