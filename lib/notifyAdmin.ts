// lib/notifyAdmin.ts

export type NotifyAdminPayload = {
  type: string;              // ex: "Urgence" | "Regeneration"
  name?: string;             // nom client
  phone?: string;            // tel client (format local accepté)
  quartier?: string;         // quartier
  message?: string;          // message optionnel
  price?: number;            // prix (FCFA)
  request_id?: string;       // id DB si tu veux
  info?: Record<string, any>; // champs libres (batterie, date, etc.)
  [key: string]: any;        // tolère des champs supplémentaires
};

export async function notifyAdmin(payload: NotifyAdminPayload) {
  const res = await fetch("/api/notify-admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const msg =
      data?.error ||
      data?.message ||
      `notify-admin failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
