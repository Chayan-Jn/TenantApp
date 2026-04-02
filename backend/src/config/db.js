import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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