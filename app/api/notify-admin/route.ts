// app/api/notify-admin/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { sendWhatsappToAdmin } from "../../../lib/whatsapp";

// Normalisation simple Gabon (+241). Ajuste si tu veux.
function normalizePhone(phone: string) {
  const p = (phone || "").replace(/[^\d+]/g, "");
  // 065xxxxxxx -> +24165xxxxxxx
  if (/^0\d{8}$/.test(p)) return `+241${p.slice(1)}`;
  // 241xxxxxxxx -> +241xxxxxxxx
  if (/^241\d{8}$/.test(p)) return `+${p}`;
  // +241xxxxxxxx OK
  if (/^\+241\d{8}$/.test(p)) return p;
  return p;
}

function inferRequestType(payload: any): string {
  // IMPORTANT: la colonne DB est request_type (NOT NULL)
  // Donc on renvoie toujours une valeur non vide.
  const rt = (payload?.request_type || "").toString().trim().toLowerCase();
  if (rt) return rt;

  const t = (payload?.type || "").toString().toLowerCase();
  if (t.includes("urgence") || t.includes("jump")) return "urgence";
  if (t.includes("régén") || t.includes("regen")) return "regeneration";

  // fallback sûr
  return "urgence";
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const request_type = inferRequestType(payload);
    const name = (payload?.name || "").toString().trim() || null;
    const phone = (payload?.phone || "").toString().trim();
    const quartier = (payload?.quartier || "").toString().trim();
    const message = (payload?.message || "").toString().trim() || null;

    const price =
      payload?.price === undefined || payload?.price === null || payload?.price === ""
        ? null
        : Number(payload.price);

    if (!phone) {
      return NextResponse.json({ success: false, error: "phone is required" }, { status: 400 });
    }
    if (!quartier) {
      return NextResponse.json({ success: false, error: "quartier is required" }, { status: 400 });
    }

    const phoneNorm = normalizePhone(phone);

    // ⚠️ ICI est le fix du 2ème problème:
    // supabaseAdmin est une fonction => il faut l'appeler.
    const sb = supabaseAdmin();

    // ⚠️ IMPORTANT: on n'insère QUE des colonnes qui existent.
    // Chez toi: request_type (NOT NULL), name, phone, quartier, message, price, status, note
    const { data: inserted, error: insertError } = await sb
      .from("requests")
      .insert({
        request_type,
        name,
        phone: phoneNorm,
        quartier,
        message,
        price,
        status: "new",
        // note: null, // optionnel
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json(
        { success: false, error: `Supabase insert: ${insertError.message}` },
        { status: 500 }
      );
    }

    // Message WhatsApp admin
    const label =
      request_type === "urgence"
        ? "🚨 URGENCE (Jump start)"
        : request_type === "regeneration"
        ? "🔋 RÉGÉNÉRATION batterie"
        : `📩 DEMANDE (${request_type})`;

    const text = [
      label,
      "",
      `Nom: ${name || "client"}`,
      `Tel: ${phoneNorm}`,
      `Quartier: ${quartier}`,
      message ? `Message: ${message}` : null,
      price !== null && !Number.isNaN(price) ? `Prix: ${price} FCFA` : null,
      "",
      `ID: ${inserted?.id ?? "n/a"}`,
    ]
      .filter(Boolean)
      .join("\n");

    // Envoi WhatsApp (si tu veux rendre ça "non bloquant", dis-moi)
    const whatsapp = await sendWhatsappToAdmin(text);

    return NextResponse.json({
      success: true,
      request: inserted,
      whatsapp,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || "notify-admin failed" },
      { status: 500 }
    );
  }
}
