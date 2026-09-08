import db from '../server/db.js';

async function insertPrices() {
  try {
    const dates = [
      { dateStr: '2026-09-06 09:30:00', arrival: '06/09/2026', factor: 0.98 },
      { dateStr: '2026-09-07 10:00:00', arrival: '07/09/2026', factor: 1.00 }
    ];

    const commodities = [
      { id: 'onion', mandi: 'Lasalgaon APMC', dist: 'Nashik', base: 2490, min: 2100, max: 2740 },
      { id: 'onion', mandi: 'Pimpalgaon Baswant APMC', dist: 'Nashik', base: 2460, min: 2080, max: 2700 },
      { id: 'onion', mandi: 'Pune Market Yard APMC', dist: 'Pune', base: 2510, min: 2120, max: 2760 },
      { id: 'onion', mandi: 'Ahmednagar APMC', dist: 'Ahilyanagar', base: 2420, min: 2040, max: 2650 },
      { id: 'onion', mandi: 'Solapur APMC', dist: 'Solapur', base: 2370, min: 2000, max: 2600 },
      { id: 'tomato', mandi: 'Narayangaon APMC', dist: 'Pune', base: 1660, min: 1340, max: 1920 },
      { id: 'tomato', mandi: 'Girnare APMC', dist: 'Nashik', base: 1580, min: 1260, max: 1840 },
      { id: 'tomato', mandi: 'Pune Market Yard APMC', dist: 'Pune', base: 1680, min: 1360, max: 1960 },
      { id: 'soyabean', mandi: 'Latur APMC', dist: 'Latur', base: 4860, min: 4540, max: 5200 },
      { id: 'soyabean', mandi: 'Amravati APMC', dist: 'Amravati', base: 4770, min: 4450, max: 5100 },
      { id: 'soyabean', mandi: 'Jalna APMC', dist: 'Jalna', base: 4830, min: 4510, max: 5170 },
      { id: 'cotton', mandi: 'Akola APMC', dist: 'Akola', base: 7420, min: 6900, max: 7900 },
      { id: 'cotton', mandi: 'Yavatmal APMC', dist: 'Yavatmal', base: 7550, min: 7000, max: 8000 },
      { id: 'cotton', mandi: 'Wardha APMC', dist: 'Wardha', base: 7350, min: 6850, max: 7820 }
    ];

    for (const d of dates) {
      for (const c of commodities) {
        const modal = Math.round(c.base * d.factor);
        const minP = Math.round(c.min * d.factor);
        const maxP = Math.round(c.max * d.factor);
        
        await db.query(
          `INSERT INTO mandi_prices (commodity_id, mandi_name, district, modal_price, min_price, max_price, trend, arrival_today, status, recommendation, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, '+1.8%', '320 Qtl', 'Active Trading', 'Sell at Home Mandi', $7)`,
          [c.id, c.mandi, c.dist, modal, minP, maxP, d.dateStr]
        );
      }
    }

    console.log('Successfully inserted 06/09 and 07/09 records into PostgreSQL mandi_prices table.');
    process.exit(0);
  } catch (err) {
    console.error('Insert error:', err.message);
    process.exit(1);
  }
}

insertPrices();
