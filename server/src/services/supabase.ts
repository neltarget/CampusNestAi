/**
 * Supabase Client
 *
 * Single source of truth for all database operations.
 * Replaces the previous PostgreSQL pool + ChromaDB setup.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith("http") &&
  supabaseUrl.includes(".supabase.co");

if (!isConfigured) {
  console.warn(
    "[Supabase] Not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in server/.env"
  );
}

const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Get the Supabase client. Throws if not configured.
 */
function getClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      "Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in server/.env"
    );
  }
  return supabase;
}

/**
 * Get a Supabase client scoped to a user's JWT.
 * This ensures RLS policies that check auth.uid() work correctly.
 */
function getClientWithToken(token: string): SupabaseClient {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase not configured");
  }
  return createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export { getClient as default, getClientWithToken };

/**
 * Helper to query Supabase with type safety.
 */
export async function querySupabase<T>(
  table: string,
  options?: {
    select?: string;
    filters?: Record<string, unknown>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
  }
): Promise<T[]> {
  const client = getClient();
  let query = client.from(table).select(options?.select ?? "*");

  if (options?.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    }
  }

  if (options?.order) {
    query = query.order(options.order.column, {
      ascending: options.order.ascending ?? false,
    });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  return (data as T[]) ?? [];
}
