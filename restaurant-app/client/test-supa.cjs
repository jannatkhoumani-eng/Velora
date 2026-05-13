const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://pingrkrqhjzaxzcfgtvi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbmdya3JxaGp6YXh6Y2ZndHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTYzMjQsImV4cCI6MjA5NDI3MjMyNH0.ne-yk1pPKheaB5Fm5bmxEsO_-aB1QztOZB8HUrs0tg0'
);

async function testInsert() {
  const payload = {
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
  };

  console.log("Attempting insert...");
  const { data, error } = await supabase.from('reservations').insert([payload]);
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success:", data);
  }
}

testInsert();
