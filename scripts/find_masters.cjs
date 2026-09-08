const https = require('https');

https.get('https://agmarknet.gov.in/static/js/main.e84f69ed.js', (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const apiMatches = b.match(/"\/[a-zA-Z0-9_\-\/]+"/g) || [];
    const masters = [...new Set(apiMatches.filter(m => 
      m.includes('state') || m.includes('commodity') || m.includes('market') || m.includes('dropdown') || m.includes('master')
    ))];
    console.log('Master endpoints:', masters);
  });
});
