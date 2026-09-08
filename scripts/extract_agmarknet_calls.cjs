const https = require('https');

https.get('https://agmarknet.gov.in/static/js/main.e84f69ed.js', (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const targets = ['lastweek', 'date-wise', 'api.agmarknet.gov.in'];
    targets.forEach(tgt => {
      let idx = 0;
      while ((idx = b.indexOf(tgt, idx)) !== -1) {
        console.log(`\n=== MATCH FOR: ${tgt} at ${idx} ===`);
        console.log(b.substring(Math.max(0, idx - 150), Math.min(b.length, idx + 250)));
        idx += tgt.length + 50;
      }
    });
  });
});
