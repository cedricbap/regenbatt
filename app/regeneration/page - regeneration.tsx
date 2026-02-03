"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { notifyAdmin } from "../../lib/notifyAdmin";

const PRICE_REGENERATION = 8000;
const LOCATION_TEXT = "Lieu: Derrière la pédiatrie, rue en face tombe Doukakas";

const SYMPTOMS = [
  "Ne tient plus la charge",
  "Démarrage difficile le matin",
  "Voyants faibles",
  "Batterie gonflée",
  "Acide qui coule / fuite",
  "Batterie se décharge vite à l'arrêt",
  "Batterie ancienne (+18 mois)",
];

function normalizePhone(phone: string) {
  let p = phone.trim().replace(/\s+/g, "").replace(/-/g, "");
  if (p.startsWith("00")) p = "+" + p.slice(2);
  return p;
}

type Status =
  | { type: "idle"; text: "" }
  | { type: "ok"; text: string }
  | { type: "err"; text: string };

export default function RegenerationPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [capacityAh, setCapacityAh] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [voltage, setVoltage] = useState("");

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle", text: "" });

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const canSubmit = useMemo(() => {
    return normalizePhone(phone).length >= 6 && date && time && !loading;
  }, [phone, date, time, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "idle", text: "" });

    const phoneNorm = normalizePhone(phone);
    if (!phoneNorm) {
      setStatus({ type: "err", text: "Le téléphone est obligatoire." });
      return;
    }
    if (!date || !time) {
      setStatus({ type: "err", text: "Choisis un jour et une heure." });
      return;
    }

    setLoading(true);

    try {
      // 1) Insert DB (requests)
      const payloadDb: any = {
        request_type: "regeneration",
        full_name: fullName?.trim() ? fullName.trim() : null,
        phone: phoneNorm,
        symptoms,
        // (si tes colonnes existent dans Supabase, tu peux les remettre)
        // capacity_ah: capacityAh ? Number(capacityAh) : null,
        // age_months: ageMonths ? Number(ageMonths) : null,
        // voltage_measured: voltage ? Number(voltage) : null,
        date,
        time,
        price_estimated: PRICE_REGENERATION,
        status: "new",
        location: LOCATION_TEXT,
      };

      const { error } = await supabase.from("requests").insert([payloadDb]);
      if (error) throw new Error(`Supabase insert: ${error.message}`);

      // 2) Notify admin via Edge Function
      const info =
        `RDV: ${date} ${time}\n` +
        `Capacité(Ah): ${capacityAh || "?"}\n` +
        `Âge(mois): ${ageMonths || "?"}\n` +
        `Tension: ${voltage || "?"}\n` +
        `Symptômes: ${symptoms.length ? symptoms.join(", ") : "—"}\n` +
        `Lieu: ${LOCATION_TEXT}`;

      await notifyAdmin({
        type: "Régénération batterie",
        name: fullName?.trim() || "Client",
        phone: phoneNorm,
        message: info,
        price: PRICE_REGENERATION,
      });

      setStatus({ type: "ok", text: "Demande envoyée ✅ Nous te répondons sur WhatsApp." });
    } catch (err: any) {
      console.error(err);
      setStatus({
        type: "err",
        text: `Erreur: impossible d'envoyer la demande. (${err?.message || "voir console"})`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow">
        <Link href="/" className="text-blue-600 text-sm">
          ← Retour
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <div className="text-2xl">🔋</div>
          <h1 className="text-3xl font-bold">Régénération batterie</h1>
        </div>

        <div className="mt-4 rounded-xl border p-4">
          <div className="font-semibold">
            Estimation : {PRICE_REGENERATION} FCFA (inclut recharge + diagnostic)
          </div>
          <div className="text-gray-600 mt-1">{LOCATION_TEXT}</div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Nom (optionnel)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Téléphone (obligatoire)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Capacité (Ah) ex: 60"
              value={capacityAh}
              onChange={(e) => setCapacityAh(e.target.value)}
              inputMode="numeric"
            />
            <input
              className="w-full rounded-xl border px-4 py-3"
              placeholder="Âge (mois) ex: 12"
              value={ageMonths}
              onChange={(e) => setAgeMonths(e.target.value)}
              inputMode="numeric"
            />
          </div>

          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Tension mesurée (optionnel) ex: 12.2"
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
            inputMode="decimal"
          />

          <div>
            <div className="font-semibold">Symptômes (clique)</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => {
                const active = symptoms.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={
                      "rounded-full border px-4 py-2 text-sm " +
                      (active ? "bg-green-600 text-white border-green-600" : "bg-white")
                    }
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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

          <button
            type="submit"
            disabled={!canSubmit}
            className={
              "w-full rounded-xl px-4 py-4 font-semibold " +
              (canSubmit ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600")
            }
          >
            {loading ? "Envoi en cours..." : "Demander la régénération ✅"}
          </button>

          {status.type === "ok" && (
            <div className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-800">
              {status.text}
            </div>
          )}
          {status.type === "err" && (
            <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-800">
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
        </form>
      </div>
    </main>
  );
}
