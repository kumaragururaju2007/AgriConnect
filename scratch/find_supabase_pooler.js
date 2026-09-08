import pg from 'pg';
import dns from 'dns/promises';

const { Client } = pg;
const projectRef = 'gpnjutgrdijnpaqastcr';
const password = 'GURU@2007200';
const encodedPassword = encodeURIComponent(password);

// Common Supabase pooler regions
const regions = [
  'ap-south-1', // Mumbai, India
  'ap-southeast-1', // Singapore
  'us-east-1', // N. Virginia
  'us-west-1', // N. California
  'eu-central-1', // Frankfurt
  'eu-west-1', // Ireland
  'ap-northeast-1', // Tokyo
  'sa-east-1'
];

async function checkHosts() {
  console.log('Resolving Supabase pooler hostnames...');
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    try {
      const addrs = await dns.lookup(host);
      console.log(`✓ Resolved ${host} -> ${addrs.address}`);
      
      // Try connecting with pooler port 6543 (transaction) and 5432 (session)
      for (const port of [6543, 5432]) {
        try {
          const client = new Client({
            host,
            port,
            user: `postgres.${projectRef}`,
            password,
            database: 'postgres',
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000
          });
          await client.connect();
          console.log(`🎉 SUCCESS! Connected to Supabase at ${host}:${port}`);
          const res = await client.query('SELECT NOW() as current_time, version();');
          console.log('Time:', res.rows[0].current_time);
          console.log('PostgreSQL version:', res.rows[0].version);
          await client.end();
          return { host, port, user: `postgres.${projectRef}` };
        } catch (e) {
          // console.log(`  Failed ${host}:${port}: ${e.message}`);
        }
      }
    } catch (err) {
      // not resolved
    }
  }
  console.log('Finished testing poolers.');
}

checkHosts();
