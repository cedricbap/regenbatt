"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { notifyAdmin } from "@/lib/notifyAdmin";

const PRICE_URGENCE = 10000;

function normalizePhoneClient(raw: string) {
  return raw.replace(/[^\d+]/g, "").trim();
}

export default function UrgencePage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [quartier, setQuartier] = useState("");
  const [message, setMessage] = useState("Batterie à plat / ne démarre plus");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const phoneNorm = useMemo(() => normalizePhoneClient(phone), [phone]);

  const canSubmit = useMemo(() => {
    return phoneNorm.length >= 6 && quartier.trim().length >= 2;
  }, [phoneNorm, quartier]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setStatus(null);

    try {
      await notifyAdmin({
  type: "urgence",
  // ou: type: "urgence" (mais request_type est mieux vu ton schéma)
  name: fullName?.trim() || "client",
  phone: phoneNorm,
  quartier: quartier.trim(),
  message: message.trim() || "Urgence",
  price: PRICE_URGENCE,
});



      setStatus({
        type: "ok",
        text: "Demande envoyée ✅ Nous te répondons sur WhatsApp.",
      });

      setFullName("");
      setPhone("");
      setQuartier("");
      setMessage("Batterie à plat / ne démarre plus");
    } catch (err: any) {
      setStatus({
        type: "err",
        text: `Erreur: impossible d'envoyer la demande. (${err?.message || "notify-admin failed"})`,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-600">
            Jump start d’urgence • Régénération batterie 12V (atelier)
          </div>
          <h1 className="text-3xl font-extrabold mt-2">Batterie à plat (Urgence)</h1>
          <div className="mt-2 font-semibold">Prix: {PRICE_URGENCE} FCFA</div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border p-6 shadow-sm space-y-5"
        >
          <div>
            <div className="font-semibold mb-1">Nom (optionnel)</div>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Jean"
            />
          </div>

          <div>
            <div className="font-semibold mb-1">Téléphone (WhatsApp)</div>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 077123456"
              inputMode="tel"
            />
            <div className="text-xs text-gray-500 mt-1">
              Astuce: tu peux mettre au format local. (Le serveur normalise si besoin.)
            </div>
          </div>

          <div>
            <div className="font-semibold mb-1">Quartier</div>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={quartier}
              onChange={(e) => setQuartier(e.target.value)}
              placeholder="Ex: Akanda / Bel Air / Nzeng..."
            />
          </div>

          <div>
            <div className="font-semibold mb-1">Message (optionnel)</div>
            <textarea
              className="w-full rounded-xl border px-4 py-3 min-h-[110px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={
              "w-full rounded-xl px-4 py-4 font-semibold " +
              (canSubmit && !loading
                ? "bg-black text-white"
                : "bg-gray-300 text-gray-600")
            }
          >
            {loading ? "Envoi en cours..." : "Envoyer la demande (Urgence)"}
          </button>

          {status && (
            <div
              className={
                "rounded-xl border px-4 py-3 " +
                (status.type === "ok"
                  ? "bg-green-50 border-green-200 text-green-900"
                  : "bg-red-50 border-red-200 text-red-900")
              }
            >
              {status.text}
            </div>
          )}

          <div className="text-sm text-gray-600">
            Pour une régénération en atelier, va sur{" "}
            <Link href="/regeneration" className="text-blue-600 underline">
              Régénération
            </Link>
            .
          </div>

          <div className="text-center">
            <Link href="/" className="text-blue-600 underline">
              Retour accueil
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
