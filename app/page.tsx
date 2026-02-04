import Image from "next/image";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(1200px 600px at 50% 0%, #0f3a3a 0%, #070b14 60%, #05070d 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          borderRadius: 28,
          padding: 28,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
          color: "#e5f6f6",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 24,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(16,185,129,0.15)",
                color: "#6ee7b7",
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              ⚡ Service batterie 12V • Libreville
            </div>

            <h1
              style={{
                fontSize: 42,
                margin: "0 0 8px",
                color: "#ffffff",
              }}
            >
              RegenBatt
            </h1>

            <p
              style={{
                margin: "0 0 16px",
                color: "rgba(255,255,255,0.8)",
                fontSize: 16,
              }}
            >
              Démarrage forcé en urgence • Régénération batterie 12V
            </p>

            {/* BADGES */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              {["Réponse rapide", "Prix transparents", "WhatsApp / Web"].map(
                (t) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.08)",
                      fontSize: 13,
                    }}
                  >
                    ✅ {t}
                  </div>
                )
              )}
            </div>

            {/* 👇 TEXTE DE GUIDAGE (BON ENDROIT) */}
            <div
              style={{
                marginBottom: 22,
                padding: "14px 18px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: 14,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              👇 <strong>Choisis le bouton qui correspond à ton besoin</strong>
              <br />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                Urgence = on vient te dépanner • Régénération = réparation +
                recharge batterie
              </span>
            </div>
          </div>

          {/* IMAGE */}
          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              padding: 12,
            }}
          >
            <Image
              src="/images/services.png"
              alt="Batterie de voiture"
              width={800}
              height={600}
              priority
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 14,
                display: "block",
              }}
            />
            <div
              style={{
                marginTop: 10,
                fontSize: 13,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              🔋 Diagnostic + intervention rapide
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
            marginTop: 28,
          }}
        >
          {/* URGENCE */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              borderRadius: 20,
              padding: 22,
              color: "#fff",
              boxShadow: "0 20px 40px rgba(239,68,68,0.35)",
            }}
          >
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              🚨 Batterie à plat
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, margin: "8px 0" }}>
              Intervention en urgence — 10 000 FCFA
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>
              Tu envoies ta position, on te rejoint.
            </div>
          </div>

          {/* REGEN */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: 20,
              padding: 22,
              color: "#fff",
              boxShadow: "0 20px 40px rgba(16,185,129,0.35)",
            }}
          >
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              🔋 Régénération batterie
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, margin: "8px 0" }}>
              8 000 FCFA
            </div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>
              Choisissez la date et l'heure pour venir déposer votre batterie. La régénération dure quelques heures.
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <a href="/contact" style={{ color: "#fff" }}>
            À propos & Contact
          </a>
          <div>© 2026 RegenBatt</div>
        </div>
      </div>
    </main>
  );
}
