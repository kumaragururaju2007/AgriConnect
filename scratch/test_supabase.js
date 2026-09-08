import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

// Supabase Direct Connection
const connectionString = 'postgresql://postgres:GURU%402007200@db.gpnjutgrdijnpaqastcr.supabase.co:5432/postgres';

async function testSupabase() {
  console.log('Testing Supabase PostgreSQL Connection...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Successfully connected to Supabase PostgreSQL!');
    const res = await client.query('SELECT NOW() as current_time, version();');
    console.log('Server Time:', res.rows[0].current_time);
    console.log('PostgreSQL Version:', res.rows[0].version);
    await client.end();
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  }
}

testSupabase();
