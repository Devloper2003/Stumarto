// Supabase Client Configuration
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials not configured. Some features may not work.');
  console.warn('Set SUPABASE_URL and SUPABASE_KEY environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
