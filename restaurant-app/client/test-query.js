import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pingrkrqhjzaxzcfgtvi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbmdya3JxaGp6YXh6Y2ZndHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTYzMjQsImV4cCI6MjA5NDI3MjMyNH0.ne-yk1pPKheaB5Fm5bmxEsO_-aB1QztOZB8HUrs0tg0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('reservations').select('*').eq('user_id', 'test');
  console.log('Error:', error);
  console.log('Data:', data);
}

test();
