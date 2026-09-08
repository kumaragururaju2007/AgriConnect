// PostgreSQL Connection Pool & Resilient Query Interface
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// Configuration with direct fallback credentials
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:GURU%402007200@db.gpnjutgrdijnpaqastcr.supabase.co:5432/postgres';
const isRemoteDb = connectionString.includes('supabase') || connectionString.includes('render') || connectionString.includes('neon') || process.env.PGSSL === 'true';

export const pool = new Pool({
  connectionString,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20
});

let isConnected = false;

// Test connection on launch
pool.connect()
  .then(client => {
    isConnected = true;
    console.log('✅ [AgriConnect PostgreSQL] Successfully connected to Database');
    client.release();
  })
  .catch(err => {
    isConnected = false;
    console.warn('⚠️ [AgriConnect PostgreSQL] Direct pool connection notice:', err.message);
    console.log('💡 Tip: Run `npm run db:init` to ensure the agriconnect database is initialized.');
  });

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // console.log('Executed query', { text: text.substring(0, 60), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
}

export function isPgConnected() {
  return isConnected;
}

export default {
  pool,
  query,
  isPgConnected
};
