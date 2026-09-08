const fs = require('fs');
const path = require('path');
const pg = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:12345@localhost:5432/agriconnect';
const pool = new pg.Pool({ connectionString });

async function run() {
  try {
    // 1. Ensure all commodities exist
    const commodities = [
      { id: 'onion', name: 'Onion (Red / लाल कांदा)', name_mr: 'कांदा (लाल)', variety: 'Gavran', category: 'Vegetable', msp: 1850 },
      { id: 'tomato', name: 'Tomato (टोमॅटो)', name_mr: 'टोमॅटो', variety: 'Abhinav', category: 'Vegetable', msp: 1400 },
      { id: 'soyabean', name: 'Soyabean (सोयाबीन)', name_mr: 'सोयाबीन', variety: 'JS-335', category: 'Oilseed', msp: 4892 },
      { id: 'cotton', name: 'Cotton (कापूस)', name_mr: 'कापूस', variety: 'BT Hybrid', category: 'Fibre', msp: 7121 },
      { id: 'tur', name: 'Tur Dal / Arhar (तूर / अरहर)', name_mr: 'तूर डाळ', variety: 'Maruti', category: 'Pulse', msp: 7550 },
      { id: 'potato', name: 'Potato (बटाटा)', name_mr: 'बटाटा', variety: 'Jyoti', category: 'Tuber', msp: 1250 },
      { id: 'garlic', name: 'Garlic (लसूण)', name_mr: 'लसूण', variety: 'Desi', category: 'Spice', msp: 6200 },
      { id: 'chilli', name: 'Green Chilli (हिरवी मिरची)', name_mr: 'हिरवी मिरची', variety: 'G-4', category: 'Spice', msp: 3200 }
    ];

    for (const c of commodities) {
      await pool.query(
        `INSERT INTO commodities (id, name, name_mr, variety, category, msp) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (id) DO NOTHING`,
        [c.id, c.name, c.name_mr, c.variety, c.category, c.msp]
      );
    }

    // 2. Load historical records
    const histPath = path.join(__dirname, '..', 'data', 'maharashtra_agmarknet_historical.json');
    const hist = JSON.parse(fs.readFileSync(histPath, 'utf8'));
    let inserted = 0;

    for (const r of hist.records) {
      const [d, mo, yr] = r.arrival_date.split('/');
      const dateStr = `${yr}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
      const ts = `${dateStr} 09:30:00`;
      
      let commId = r.commodity.toLowerCase().includes('onion') ? 'onion' :
                   r.commodity.toLowerCase().includes('tomato') ? 'tomato' :
                   r.commodity.toLowerCase().includes('soya') ? 'soyabean' :
                   r.commodity.toLowerCase().includes('cotton') ? 'cotton' :
                   r.commodity.toLowerCase().includes('tur') || r.commodity.toLowerCase().includes('arhar') ? 'tur' :
                   r.commodity.toLowerCase().includes('potato') ? 'potato' :
                   r.commodity.toLowerCase().includes('garlic') ? 'garlic' :
                   r.commodity.toLowerCase().includes('chilli') ? 'chilli' : 'onion';

      const check = await pool.query(
        'SELECT id FROM mandi_prices WHERE commodity_id = $1 AND mandi_name = $2 AND updated_at::date = $3::date',
        [commId, r.market, dateStr]
      );

      if (check.rows.length === 0) {
        await pool.query(
          'INSERT INTO mandi_prices (commodity_id, mandi_name, district, modal_price, min_price, max_price, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [commId, r.market, r.district, r.modal_price, r.min_price, r.max_price, ts]
        );
        inserted++;
      }
    }

    console.log(`Successfully synced ${inserted} historical records to PostgreSQL mandi_prices table.`);
    await pool.end();
  } catch (err) {
    console.error('Sync failed:', err.message);
    await pool.end();
  }
}

run();
