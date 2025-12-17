// /lib/db/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validate environment variables on startup
if (!supabaseUrl || !publishableKey || !secretKey) {
  throw new Error('Missing required Supabase environment variables.');
}

// Client for browser/frontend use (e.g., app/research/page.tsx)
export const supabase = createClient(supabaseUrl, publishableKey, {
  auth: { persistSession: false }
});

// Admin client for secure server-side use (e.g., app/api/opportunities/create/route.ts)
// **Never use this in the browser**[citation:1]
export const supabaseAdmin = createClient(supabaseUrl, secretKey, {
  auth: { persistSession: false }
});