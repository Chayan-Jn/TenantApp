import pg from 'pg';
import { env } from './backend/src/config/env.js';

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

async function run() {
  const result = await pool.query(`
    SELECT rp.id, rp.tenant_id, rp.due_date, t.name, p.owner_id
    FROM rent_payments rp
    JOIN tenants t ON rp.tenant_id = t.id
    JOIN units u ON t.unit_id = u.id
    JOIN properties p ON u.property_id = p.id
    WHERE rp.status != 'paid'
  `);
  console.log("ALL UNPAID:", result.rows);
  console.log("TOTAL UNPAID:", result.rows.length);

  process.exit(0);
}
run();
