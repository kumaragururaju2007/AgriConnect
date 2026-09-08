const https = require('https');

https.get('https://agmarknet.gov.in/static/js/main.e84f69ed.js', (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    // Find references to commodity-price/lastweek
    const idx = b.indexOf('/prices-and-arrivals/commodity-price/lastweek');
    if (idx !== -1) {
      console.log('--- commodity-price/lastweek context ---');
      console.log(b.substring(Math.max(0, idx - 400), Math.min(b.length, idx + 400)));
    }

    // Find state dropdown codes (e.g. Maharashtra code: MH or numeric 14 or 27)
    const mhIdx = b.indexOf('Maharashtra');
    if (mhIdx !== -1) {
      console.log('--- Maharashtra context ---');
      console.log(b.substring(Math.max(0, mhIdx - 200), Math.min(b.length, mhIdx + 200)));
    }
  });
});
