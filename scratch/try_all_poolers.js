import pg from 'pg';

const { Client } = pg;
const projectRef = 'gpnjutgrdijnpaqastcr';
const password = 'GURU@2007200';

const poolers = [
  'aws-0-ap-south-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-0-us-east-2.pooler.supabase.com',
  'aws-0-us-west-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-0-ap-northeast-1.pooler.supabase.com'
];

async function tryConnections() {
  for (const host of poolers) {
    for (const port of [6543, 5432]) {
      for (const user of [`postgres.${projectRef}`, 'postgres']) {
        process.stdout.write(`Testing ${host}:${port} (${user})... `);
        const client = new Client({
          host,
          port,
          user,
          password,
          database: 'postgres',
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 4000
        });

        try {
          await client.connect();
          console.log(`\n🎉🎉 CONNECTED SUCCESSFULLY to ${host}:${port}! User: ${user}`);
          const res = await client.query('SELECT current_database(), version();');
          console.log('Database:', res.rows[0].current_database);
          console.log('Version:', res.rows[0].version);
          await client.end();
          return { host, port, user };
        } catch (err) {
          console.log(`Failed: ${err.message}`);
        }
      }
    }
  }
}

tryConnections();
