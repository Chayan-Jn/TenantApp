import pg from 'pg';
const { Pool } = pg;
import { env } from './env.js';

// Heroku's injected URL might have ?sslmode=require, we can strip it to let our ssl object take control,
// or just use it directly. We'll strip it to avoid conflicts.
const connectionString = env.DATABASE_URL ? env.DATABASE_URL.split('?')[0] : '';

const pool = new Pool({
  connectionString: connectionString,
  max: 12, 
  connectionTimeoutMillis: 5000,
  ...(env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false
    }
  })
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