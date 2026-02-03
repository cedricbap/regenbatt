// lib/whatsapp.ts
type WhatsappResult = {
  ok: boolean;
  status: number;
  data?: any;
  error?: string;
};

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env var: ${name}`);
  return v.trim();
}

/**
 * Envoi WhatsApp via WhatsApp Cloud API (Meta).
 * Variables env attendues (exemple) :
 * - WHATSAPP_TOKEN
 * - WHATSAPP_PHONE_NUMBER_ID
 * - ADMIN_WHATSAPP_TO   (numéro admin en format international, ex: +241XXXXXXXX)
 */
export async function sendWhatsappToAdmin(text: string): Promise<WhatsappResult> {
  const token = mustEnv("WHATSAPP_TOKEN");
  const phoneNumberId = mustEnv("WHATSAPP_PHONE_NUMBER_ID");
  const to = mustEnv("ADMIN_WHATSAPP_TO");

  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      data,
      error: data?.error?.message || data?.message || res.statusText,
    };
  }

  return { ok: true, status: res.status, data };
}
