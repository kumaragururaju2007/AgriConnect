import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials
const projectRef = 'gpnjutgrdijnpaqastcr';
const password = process.env.PGPASSWORD || 'GURU@2007200';

const connectionAttempts = [
  // 1. Direct connection
  {
    name: 'Direct Supabase host',
    connectionString: `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`
  },
  // 2. AWS poolers with session & transaction mode
  {
    name: 'AWS ap-south-1 Session Pooler (5432)',
    connectionString: `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`
  },
  {
    name: 'AWS ap-south-1 Transaction Pooler (6543)',
    connectionString: `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`
  },
  {
    name: 'AWS ap-southeast-1 Session Pooler (5432)',
    connectionString: `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`
  },
  {
    name: 'AWS us-east-1 Session Pooler (5432)',
    connectionString: `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
  },
  {
    name: 'AWS eu-central-1 Session Pooler (5432)',
    connectionString: `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`
  }
];

async function runMigration() {
  console.log('🔄 Checking connection to Supabase database...');
  let connectedClient = null;

  for (const attempt of connectionAttempts) {
    console.log(`Trying: ${attempt.name}...`);
    const client = new Client({
      connectionString: attempt.connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });

    try {
      await client.connect();
      console.log(`✅ Connected successfully via: ${attempt.name}!`);
      connectedClient = client;
      break;
    } catch (err) {
      console.log(`  ❌ Failed: ${err.message}`);
    }
  }

  if (!connectedClient) {
    console.log('\n⚠️ Could not connect directly. Checking localhost PostgreSQL as fallback...');
    const localClient = new Client({
      connectionString: 'postgresql://postgres:12345@localhost:5432/agriconnect'
    });
    try {
      await localClient.connect();
      console.log('✅ Connected to Localhost PostgreSQL!');
      connectedClient = localClient;
    } catch (e) {
      console.error('Localhost connection failed as well:', e.message);
      return;
    }
  }

  try {
    console.log('\n📦 Applying full Schema, RLS policies, and Permissions...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'server', 'schema.sql'), 'utf-8');
    await connectedClient.query(schemaSql);
    console.log('✓ Schema & Tables created.');

    const seedSql = fs.readFileSync(path.join(__dirname, '..', 'server', 'seed.sql'), 'utf-8');
    await connectedClient.query(seedSql);
    console.log('✓ Seed data populated.');

    const countRes = await connectedClient.query('SELECT count(*) FROM farmers;');
    console.log(`✓ Farmers count: ${countRes.rows[0].count}`);
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await connectedClient.end();
  }
}

runMigration();
