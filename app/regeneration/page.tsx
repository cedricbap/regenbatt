"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { notifyAdmin } from "../../lib/notifyAdmin";

const PRICE_REGEN = 8000;

function normalizePhoneClient(raw: string) {
  return raw.replace(/[^\d+]/g, "").trim();
}

export default function RegenerationPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [quartier, setQuartier] = useState("");

  const [batteryAh, setBatteryAh] = useState("");
  const [batteryV, setBatteryV] = useState("12");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const phoneNorm = useMemo(() => normalizePhoneClient(phone), [phone]);

  const canSubmit = useMemo(() => {
    return phoneNorm.length >= 6 && quartier.trim().length >= 2;
  }, [phoneNorm, quartier]);

  function toggleSymptom(s: string) {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setStatus(null);

    try {
      await notifyAdmin({
        type: "Regeneration",
        name: fullName.trim() || "client",
        phone: phoneNorm,
        quartier: quartier.trim(),
        message: message.trim() || "Demande de régénération",
        price: PRICE_REGEN,
        info: {
          batteryV,
          batteryAh,
          symptoms,
          desired_date: date,
          desired_time: time,
          location_note: "Derrière la pédiatrie",
        },
      });

      setStatus({
        type: "ok",
        text: "Demande envoyée ✅ Nous te répondons sur WhatsApp.",
      });

      setFullName("");
      setPhone("");
      setQuartier("");
      setBatteryAh("");
      setBatteryV("12");
      setSymptoms([]);
      setDate("");
      setTime("");
      setMessage("");
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

  const SYMPTOMS = [
    "Démarre difficilement",
    "Batterie se décharge vite",
    "Voyant batterie",
    "Voiture immobilisée",
    "Autre",
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="text-center mb-8">
          <div className="text-sm text-gray-600">
            Jump start d’urgence • Régénération batterie 12V (atelier)
          </div>
          <h1 className="text-3xl font-extrabold mt-2">Régénération batterie</h1>
          <div className="mt-2 font-semibold">Prix: {PRICE_REGEN} FCFA</div>
          <div className="text-sm text-gray-600 mt-1">Lieu: Derrière la pédiatrie</div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-1">Tension batterie</div>
              <select
                className="w-full rounded-xl border px-4 py-3"
                value={batteryV}
                onChange={(e) => setBatteryV(e.target.value)}
              >
                <option value="12">12V</option>
                <option value="24">24V</option>
              </select>
            </div>

            <div>
              <div className="font-semibold mb-1">Capacité (Ah) (optionnel)</div>
              <input
                className="w-full rounded-xl border px-4 py-3"
                value={batteryAh}
                onChange={(e) => setBatteryAh(e.target.value)}
                placeholder="Ex: 60"
                inputMode="numeric"
              />
            </div>
          </div>

          <div>
            <div className="font-semibold mb-2">Symptômes</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SYMPTOMS.map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={symptoms.includes(s)}
                    onChange={() => toggleSymptom(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="font-semibold mb-1">Jour souhaité</div>
              <input
                type="date"
                className="w-full rounded-xl border px-4 py-3"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <div className="font-semibold mb-1">Heure souhaitée</div>
              <input
                type="time"
                className="w-full rounded-xl border px-4 py-3"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="font-semibold mb-1">Message (optionnel)</div>
            <textarea
              className="w-full rounded-xl border px-4 py-3 min-h-[110px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: batterie récente / ancienne, voiture modèle, etc."
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={
              "w-full rounded-xl px-4 py-4 font-semibold " +
              (canSubmit && !loading
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-600")
            }
          >
            {loading ? "Envoi en cours..." : "Demander la régénération ✅"}
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
            🚨 Pour un dépannage immédiat (jump start), utilise plutôt{" "}
            <Link href="/urgence" className="text-blue-600 underline">
              Urgence
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
