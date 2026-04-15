import pool from './backend/src/config/db.js';
async function test() {
  const params = [1]; // assuming owner_id 1
  const result = await pool.query(`SELECT rp.id, rp.tenant_id, rp.due_date, p.name as property_name, u.label FROM rent_payments rp JOIN tenants t ON rp.tenant_id = t.id JOIN units u ON t.unit_id = u.id JOIN properties p ON u.property_id = p.id WHERE p.owner_id = $1`);
  console.log(result.rows);
  const owners = await pool.query('SELECT * FROM owners');
  console.log('owners', owners.rows);
  process.exit();
}
test();
