import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Supabase URL or Key is missing!', { SUPABASE_URL, SUPABASE_KEY });
  throw new Error('Supabase URL or Key is missing! Check your .env file and restart the dev server.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
