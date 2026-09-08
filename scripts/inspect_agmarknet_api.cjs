const https = require('https');

https.get('https://agmarknet.gov.in/static/js/main.e84f69ed.js', (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('Script length:', b.length);
    const matches = b.match(/https?:\/\/[^\s"'`]+/g) || [];
    const filteredUrls = [...new Set(matches.filter(m => m.includes('api') || m.includes('agmarknet') || m.includes('.gov.in')))];
    console.log('URLs in main bundle:', filteredUrls.slice(0, 30));

    const apiMatches = b.match(/"\/[a-zA-Z0-9_\-\/]+"/g) || [];
    const filteredApis = [...new Set(apiMatches.filter(m => m.includes('price') || m.includes('mandi') || m.includes('arrival') || m.includes('report') || m.includes('data')))];
    console.log('API paths:', filteredApis.slice(0, 30));
  });
}).on('error', console.error);
