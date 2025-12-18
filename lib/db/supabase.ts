// /lib/db/supabase.ts - UPDATED
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!publishableKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
}
if (!secretKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

// Client for frontend/browser use (read-only)
export const supabase = createClient(supabaseUrl, publishableKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Admin client for server-side/API use (full permissions)
export const supabaseAdmin = createClient(supabaseUrl, secretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Helper function for safe queries
export async function safeSelect<T>(
  query: any,
  fields: string,
  debugName: string = 'query'
): Promise<T | null> {
  try {
    const { data, error } = await query.select(fields);
    
    if (error) {
      console.error(`❌ ${debugName} error:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`💥 ${debugName} exception:`, error);
    return null;
  }
}