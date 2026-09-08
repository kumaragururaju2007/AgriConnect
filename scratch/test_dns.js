import dns from 'dns/promises';
import pg from 'pg';

const { Client } = pg;

async function testDns() {
  const host = 'db.gpnjutgrdijnpaqastcr.supabase.co';
  console.log('Lookup all for:', host);
  try {
    const res = await dns.lookup(host, { all: true });
    console.log('Result:', res);

    if (res && res.length > 0) {
      const client = new Client({
        host: res[0].address,
        port: 5432,
        user: 'postgres',
        password: 'GURU@2007200',
        database: 'postgres',
        ssl: { rejectUnauthorized: false }
      });
      await client.connect();
      console.log('Connected via resolved IP:', res[0].address);
      const queryRes = await client.query('SELECT version();');
      console.log('Postgres version:', queryRes.rows[0].version);
      await client.end();
    }
  } catch (err) {
    console.error('DNS / Connect error:', err);
  }
}

testDns();
