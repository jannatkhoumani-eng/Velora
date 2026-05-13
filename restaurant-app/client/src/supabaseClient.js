import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pingrkrqhjzaxzcfgtvi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbmdya3JxaGp6YXh6Y2ZndHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTYzMjQsImV4cCI6MjA5NDI3MjMyNH0.ne-yk1pPKheaB5Fm5bmxEsO_-aB1QztOZB8HUrs0tg0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
