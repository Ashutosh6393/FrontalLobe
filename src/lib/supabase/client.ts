import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Reads public env vars (safe to expose).
 * Wired now; auth and queries arrive in later slices.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
