// app/api/admin/requests/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * DEV BYPASS (À SUPPRIMER EN PROD)
 * - Autorise localhost / 127.0.0.1 en dev
 * - Ou ADMIN_DEV_BYPASS=1
 */
function isDevBypass(req: Request) {
  if (process.env.NODE_ENV !== "development") return false;
  if (process.env.ADMIN_DEV_BYPASS === "1") return true;

  const host = (req.headers.get("host") || "").toLowerCase();
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

function assertAuthorized(req: Request) {
  if (isDevBypass(req)) return;

  const expected = (process.env.ADMIN_API_KEY || "").trim();
  if (!expected) {
    const err: any = new Error("Missing ADMIN_API_KEY env var");
    err.status = 500;
    throw err;
  }

  const got = (req.headers.get("x-admin-key") || "").trim();
  if (!got || got !== expected) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
}

function getSupabaseAdmin() {
  // IMPORTANT: côté serveur, utilise SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "";
  const service =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE ||
    "";

  if (!url || !service) {
    throw new Error("Missing env: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, service, {
    auth: { persistSession: false },
  });
}

export async function GET(req: Request) {
  try {
    assertAuthorized(req);

    const { searchParams } = new URL(req.url);
    const type = (searchParams.get("type") || "all").toLowerCase();
    const status = (searchParams.get("status") || "all").toLowerCase();
    const q = (searchParams.get("q") || "").trim();

    const supabase = getSupabaseAdmin();

    // ✅ Colonnes attendues par ton schéma actuel
    let query = supabase
      .from("requests")
      .select(
        "id, created_at, request_type, full_name, phone, quartier, message, price, status, note"
      )
      .order("created_at", { ascending: false })
      .limit(200);

    // Filters
    if (type !== "all") {
      query = query.eq("request_type", type);
    }
    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (q) {
      // Recherche OR sur plusieurs champs (ilike)
      const qq = q.replace(/,/g, " "); // évite de casser le .or()
      const pattern = `%${qq}%`;

      query = query.or(
        [
          `phone.ilike.${pattern}`,
          `full_name.ilike.${pattern}`,
          `quartier.ilike.${pattern}`,
          `message.ilike.${pattern}`,
          `note.ilike.${pattern}`,
          `request_type.ilike.${pattern}`,
        ].join(",")
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data ?? [] }, { status: 200 });
  } catch (e: any) {
    const status = e?.status || 500;
    return NextResponse.json(
      { success: false, error: e?.message || "Unknown error" },
      { status }
    );
  }
}
