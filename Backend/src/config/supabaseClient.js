import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // MUST BE AT THE TOP

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// --- DETAILED LOGS ---
console.log("--- Backend Supabase Config ---");
console.log("SUPABASE_URL loaded:", supabaseUrl ? supabaseUrl : "MISSING or undefined");
console.log("SUPABASE_SERVICE_KEY loaded:", supabaseKey ? `YES (starts with ${supabaseKey.substring(0, 5)}...)` : "MISSING or undefined"); // Log first 5 chars
// --- END LOGS ---

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Service Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);