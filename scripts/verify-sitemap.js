const https = require('https');

const url = 'https://www.fph.my.id/sitemap.xml';

console.log(`Checking sitemap at: ${url}`);
console.log('----------------------------------------');

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
};

https.get(url, options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Content-Type: ${res.headers['content-type']}`);
  console.log(`Content-Length: ${res.headers['content-length'] || 'unknown'} bytes`);
  console.log('----------------------------------------');

  if (res.statusCode !== 200) {
    console.error('❌ ERROR: Sitemap returned non-200 status code!');
    process.exit(1);
  }

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (data.includes('<?xml') && data.includes('<urlset')) {
      console.log('✅ SUCCESS: Valid XML format detected.');
      console.log('Preview (first 200 chars):');
      console.log(data.substring(0, 200));
    } else {
      console.error('❌ ERROR: Response does not look like a valid XML sitemap.');
      console.log('Received data preview:');
      console.log(data.substring(0, 200));
    }
  });

}).on('error', (err) => {
  console.error('❌ NETWORK ERROR:', err.message);
});
