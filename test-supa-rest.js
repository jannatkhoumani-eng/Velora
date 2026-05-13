const https = require('https');

const payload = JSON.stringify({
    nom: 'Test',
    prenom: 'User',
    telephone: '0600000000',
    date: '13/05/26',
    heure: '19:00',
    persons: 2,
    table: 1,
    experience: 'Standard',
    isRamadan: false,
    groupType: 'Friends',
    specialRequests: ''
});

const options = {
  hostname: 'pingrkrqhjzaxzcfgtvi.supabase.co',
  port: 443,
  path: '/rest/v1/reservations',
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbmdya3JxaGp6YXh6Y2ZndHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTYzMjQsImV4cCI6MjA5NDI3MjMyNH0.ne-yk1pPKheaB5Fm5bmxEsO_-aB1QztOZB8HUrs0tg0',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbmdya3JxaGp6YXh6Y2ZndHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTYzMjQsImV4cCI6MjA5NDI3MjMyNH0.ne-yk1pPKheaB5Fm5bmxEsO_-aB1QztOZB8HUrs0tg0',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let data = '';
  res.on('data', d => {
    data += d;
  });
  res.on('end', () => {
    console.log(data);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(payload);
req.end();
