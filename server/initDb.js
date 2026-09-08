// Database Initializer & Migration Runner for PostgreSQL 18
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.PGUSER || 'postgres'}:${encodeURIComponent(process.env.PGPASSWORD || '12345')}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || '5432'}/${process.env.PGDATABASE || 'agriconnect'}`;
const isRemoteDb = connectionString.includes('supabase') || connectionString.includes('render') || connectionString.includes('neon') || process.env.PGSSL === 'true';

async function initDatabase() {
  console.log('🚀 [AgriConnect DB Init] Connecting to Database...');
  
  const client = new Client({
    connectionString,
    ssl: isRemoteDb ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log(`✓ Connected to Database. Applying schema and seed data...`);

    // Read and run schema.sql
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await targetClient.query(schemaSql);
    console.log('✓ Schema applied successfully (Tables created).');

    // Read and run seed.sql
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    await targetClient.query(seedSql);
    console.log('✓ Seed data populated successfully.');

    // Count rows in key tables to confirm
    const tables = ['farmers', 'commodities', 'mandi_prices', 'lots', 'buyers', 'deals', 'grievances', 'warehouses'];
    console.log('\n📊 [Database Verification Summary]');
    for (const table of tables) {
      const res = await targetClient.query(`SELECT COUNT(*) as count FROM ${table};`);
      console.log(`  - ${table.padEnd(16)}: ${res.rows[0].count} records`);
    }
    console.log('\n🎉 [AgriConnect PostgreSQL Initialized Successfully!]\n');
  } catch (err) {
    console.error('Error executing schema/seed:', err.message);
    throw err;
  } finally {
    await targetClient.end();
  }
}

initDatabase().catch(err => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});
