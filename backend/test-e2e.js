import fetch from 'node-fetch';

const API = 'http://localhost:5000';
let token = '';

const request = async (method, path, body = null, isLogin = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Cookie'] = `token=${token}`;
  
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`${API}${path}`, options);
  
  if (isLogin) {
    const cookieHeader = res.headers.get('set-cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`API Error [${method} ${path}]: ${res.status} - ${JSON.stringify(data)}`);
  }
  return data;
};

const run = async () => {
  try {
    console.log('--- STARTING EXTENSIVE SDE3 INTEGRATION TESTS ---');
    
    const ts = Date.now();
    const email = `test_pro_${ts}@test.com`;

    console.log(`1. Registering & Authenticating user ${email}`);
    await request('POST', '/auth/register', { name: 'Pro Tester', username: `pro_${ts}`, password: 'Password!123' });
    await request('POST', '/auth/login', { username: `pro_${ts}`, password: 'Password!123' }, true);
    console.log('   ✓ Authentication verified');

    console.log('2. Setting up Multiple Properties');
    const p1 = await request('POST', '/properties', { name: 'Alpha Tower', address: '101 Street', type: 'flat' });
    const p2 = await request('POST', '/properties', { name: 'Beta Residency', address: '202 Avenue', type: 'pg' });
    console.log('   ✓ Multiple properties created');

    console.log('3. Setting up Units & Tenants');
    const u1 = await request('POST', '/units', { property_id: p1.data.id, label: 'A-101', rent: 10000 });
    const u2 = await request('POST', '/units', { property_id: p2.data.id, label: 'Room-1', rent: 5000 });
    
    const t1 = await request('POST', '/tenants', {
      unit_id: u1.data.id,
      name: 'Alpha Tenant',
      phone: '1234567890',
      join_date: '2024-01-01',
      security_deposit: 10000,
      rent_due_day: 5
    });
    
    const t2 = await request('POST', '/tenants', {
      unit_id: u2.data.id,
      name: 'Beta Tenant',
      phone: '0987654321',
      join_date: '2024-01-01',
      security_deposit: 5000,
      rent_due_day: 10
    });
    console.log('   ✓ Multi-tenant environment established');

    console.log('4. Testing Rent Generation Cross-Contamination');
    // Generating rent for Alpha Tower should NOT affect Beta Residency
    const rentAlpha = await request('POST', '/rent/generate', { month: 5, year: 2024, property_id: p1.data.id });
    if (rentAlpha.data.generated !== 1) throw new Error('Rent generation failed for specific property');
    
    const rentsBeta = await request('GET', `/rent?tenant_id=${t2.data.id}`);
    if (rentsBeta.data.length > 0) throw new Error('Data bleed detected: Rent generated for wrong property');
    console.log('   ✓ Isolation verified (No cross-contamination)');

    console.log('5. Testing Overdue Detection');
    // Create an old unpaid rent record
    const oldRent = await request('POST', '/rent', {
      tenant_id: t1.data.id,
      amount: 10000,
      due_date: '2024-04-01'
    });
    
    const overdue = await request('GET', '/rent/overdue?property_id=all');
    const hasOld = overdue.data.some(r => r.id === oldRent.data.id);
    if (!hasOld) throw new Error('Overdue rent not detected');
    console.log('   ✓ Overdue logic verified');

    console.log('6. Testing Bill Splitting (Equal Split)');
    const bill = await request('POST', '/bills', {
      unit_id: u1.data.id,
      type: 'electricity',
      amount: 1200,
      split_type: 'equal',
      month: 5,
      year: 2024
    });
    
    const splits = await request('GET', `/bills/${bill.data.id}/splits`);
    if (splits.data.length !== 1) throw new Error('Split count mismatch');
    if (Number(splits.data[0].amount) !== 1200) throw new Error('Split amount mismatch');
    console.log('   ✓ Bill splitting verified');

    console.log('7. Testing Bill Status Automation');
    // Mark split as paid
    await request('PATCH', `/bills/splits/${splits.data[0].id}/status`, { status: 'paid' });
    const updatedBill = await request('GET', `/bills?unit_id=${u1.data.id}`);
    const targetBill = updatedBill.data.find(b => b.id === bill.data.id);
    if (targetBill.status !== 'paid') throw new Error('Bill status auto-update failed');
    console.log('   ✓ Split-to-Bill status cascade verified');

    console.log('8. Testing Notice Period Logic (Start/End Dates)');
    await request('PATCH', `/tenants/${t1.data.id}/notice`, { expected_move_out: '2024-06-30' });
    const tenantWithNotice = await request('GET', `/tenants/${t1.data.id}`);
    if (!tenantWithNotice.data.notice_date) throw new Error('Notice date not recorded');
    console.log('   ✓ Notice period state verified');

    console.log('9. Testing Clean Deletion Flow');
    await request('DELETE', `/tenants/${t1.data.id}`, { leave_date: '2024-06-30' });
    await request('DELETE', `/properties/${p1.data.id}`);
    await request('DELETE', `/properties/${p2.data.id}`);
    console.log('   ✓ Full system cleanup verified');

    console.log('\n================================================');
    console.log('✅ ALL PRO-LEVEL E2E TESTS PASSED PERFECTLY! ✅');
    console.log('================================================');
  } catch (err) {
    console.error('\n❌ TEST FAILURE DETECTED:', err.message);
    process.exit(1);
  }
};

run();
