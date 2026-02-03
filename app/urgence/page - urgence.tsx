"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export default function UrgencePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quartier, setQuartier] = useState("");
  const [message, setMessage] = useState("Batterie à plat / ne démarre plus");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const canSend = useMemo(() => {
    // Pour une urgence, au minimum téléphone + quartier
    return phone.trim().length >= 6 && quartier.trim().length >= 2;
  }, [phone, quartier]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    try {
      const resp = await fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Urgence",
          name: name.trim() || undefined,
          phone: phone.trim(),
          quartier: quartier.trim(),
          message: message.trim() || "Urgence démarrage (jump start)",
        }),
      });

      const data = await resp.json();

      if (!resp.ok || !data?.success) {
        console.error("API error:", data);
        setResult({ ok: false, msg: "Erreur: impossible d’envoyer la demande. Regarde la console." });
      } else {
        setResult({ ok: true, msg: "✅ Demande envoyée ! On te contacte très vite." });

        // option: reset
        // setName(""); setPhone(""); setQuartier(""); setMessage("Batterie à plat / ne démarre plus");
      }
    } catch (err) {
      console.error(err);
      setResult({ ok: false, msg: "Erreur réseau. Vérifie ta connexion." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "min(720px, 100%)" }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, textAlign: "center", marginBottom: 8 }}>
          RechargBatt
        </h1>
        <p style={{ textAlign: "center", opacity: 0.8, marginBottom: 20 }}>
          Jump start d’urgence • Régénération batterie 12V (atelier)
        </p>

        <div style={{ display: "grid", gap: 14 }}>
          <div
            style={{
              background: "#c00000",
              color: "white",
              padding: "16px 18px",
              borderRadius: 14,
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            🚨 Batterie à plat (Urgence)
          </div>

          <form
            onSubmit={onSubmit}
            style={{
              background: "white",
              borderRadius: 14,
              padding: 16,
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "grid", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 700 }}>Nom (optionnel)</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Jean Dupont"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 700 }}>Téléphone (WhatsApp)</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 077123456"
                  style={inputStyle}
                />
                <small style={{ opacity: 0.7 }}>
                  Astuce: tu peux mettre au format local. (Ton Edge Function peut ensuite normaliser si besoin.)
                </small>
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 700 }}>Quartier</span>
                <input
                  value={quartier}
                  onChange={(e) => setQuartier(e.target.value)}
                  placeholder="Ex: Akanda, Nzeng-Ayong, etc."
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 700 }}>Message (optionnel)</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </label>

              <button
                type="submit"
                disabled={!canSend || loading}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "none",
                  fontWeight: 800,
                  cursor: !canSend || loading ? "not-allowed" : "pointer",
                  background: !canSend || loading ? "#ddd" : "#111",
                  color: !canSend || loading ? "#666" : "white",
                }}
              >
                {loading ? "Envoi..." : "Envoyer la demande (Urgence)"}
              </button>

              {result && (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: result.ok ? "rgba(0,160,60,0.10)" : "rgba(200,0,0,0.10)",
                    border: `1px solid ${result.ok ? "rgba(0,160,60,0.25)" : "rgba(200,0,0,0.25)"}`,
                    fontWeight: 700,
                  }}
                >
                  {result.msg}
                </div>
              )}
            </div>
          </form>

          <div style={{ textAlign: "center" }}>
            <Link href="/" style={{ textDecoration: "underline" }}>
              Retour accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.15)",
  outline: "none",
};
