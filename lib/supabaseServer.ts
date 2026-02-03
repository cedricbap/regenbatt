// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE url or service role key in env.");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
