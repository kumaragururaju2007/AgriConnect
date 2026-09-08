import pg from 'pg';

const { Client } = pg;
const projectRef = 'gpnjutgrdijnpaqastcr';
const password = 'GURU@2007200';

const otherRegions = [
  'ap-southeast-2', // Sydney
  'eu-west-2',      // London
  'eu-west-3',      // Paris
  'eu-north-1',     // Stockholm
  'me-central-1',   // UAE
  'me-south-1',     // Bahrain
  'ca-central-1',   // Canada
  'sa-east-1'       // São Paulo
];

async function checkMoreRegions() {
  for (const reg of otherRegions) {
    const host = `aws-0-${reg}.pooler.supabase.com`;
    for (const port of [5432, 6543]) {
      process.stdout.write(`Testing ${host}:${port}... `);
      const client = new Client({
        host,
        port,
        user: `postgres.${projectRef}`,
        password,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3500
      });

      try {
        await client.connect();
        console.log(`\n🎉🎉 CONNECTED SUCCESSFULLY to ${host}:${port}!`);
        const res = await client.query('SELECT current_database(), version();');
        console.log('Database:', res.rows[0].current_database);
        await client.end();
        return { host, port };
      } catch (err) {
        console.log(`Failed: ${err.message}`);
      }
    }
  }
}

checkMoreRegions();
