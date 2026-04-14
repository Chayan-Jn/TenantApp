import pg from 'pg';
const { Pool } = pg;
import {env} from './env.js'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const connectToDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('DB connected successfully');
  } catch (err) {
    console.error('Error connecting to db', err);
  }
};

export default pool;