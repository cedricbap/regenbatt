import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 16px",
        background:
          "radial-gradient(1200px 600px at 50% 20%, rgba(16,185,129,0.18), transparent 60%), linear-gradient(180deg, #0b1220 0%, #0b1220 40%, #0f172a 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          borderRadius: 22,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        {/* Header / Hero */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 18,
            padding: 28,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                gap: 10,
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.25)",
                color: "#a7f3d0",
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              <span>⚡</span>
              <span>Service batterie 12V • Libreville</span>
            </div>

            <h1
              style={{
                margin: 0,
                color: "white",
                fontSize: 44,
                letterSpacing: -0.6,
                lineHeight: 1.05,
              }}
            >
              RegenBatt
            </h1>

            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                color: "rgba(255,255,255,0.78)",
                fontSize: 16,
                lineHeight: 1.5,
              }}
            >
              Jump start d’urgence • Régénération batterie 12V
            </p>

            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "8px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 13,
                }}
              >
                ✅ Réponse rapide
              </span>
              <span
                style={{
                  padding: "8px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 13,
                }}
              >
                ✅ Prix transparents
              </span>
              <span
                style={{
                  padding: "8px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 13,
                }}
              >
                ✅ WhatsApp / Web
              </span>
            </div>
          </div>

          {/* Image */}
          <div
            style={{
              justifySelf: "end",
              width: "100%",
              maxWidth: 360,
              borderRadius: 18,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              padding: 14,
            }}
          >
            <div style={{ borderRadius: 14, overflow: "hidden" }}>
              <Image
                src="public/images/2Batteries.png"
                alt="Batterie de voiture"
                width={800}
                height={600}
                style={{ width: "100%", height: "auto", display: "block" }}
                priority
              />
            </div>
            <div style={{ marginTop: 10, color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
              🔋 Diagnostic + intervention rapide
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            padding: 28,
            paddingTop: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          <Link
            href="/urgence"
            style={{
              textDecoration: "none",
              display: "block",
              borderRadius: 16,
              padding: 18,
              background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
              color: "white",
              boxShadow: "0 18px 40px rgba(239,68,68,0.25)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div style={{ fontSize: 14, opacity: 0.9 }}>🚨 Batterie à plat</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>
              Intervention en urgence — 10 000 FCFA
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8 }}>
              Tu envoies ta position, on te rejoint.
            </div>
          </Link>

          <Link
            href="/regeneration"
            style={{
              textDecoration: "none",
              display: "block",
              borderRadius: 16,
              padding: 18,
              background: "linear-gradient(135deg, #10b981 0%, #065f46 100%)",
              color: "white",
              boxShadow: "0 18px 40px rgba(16,185,129,0.18)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div style={{ fontSize: 14, opacity: 0.92 }}>🔋 Régénération batterie</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>
              8 000 FCFA
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8 }}>
              Dépose ou rendez-vous selon ton besoin.
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 22,
            borderTop: "1px solid rgba(255,255,255,0.10)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/contact"
            style={{
              color: "rgba(255,255,255,0.85)",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            À propos & Contact
          </Link>

          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
            © {new Date().getFullYear()} RegenBatt
          </div>
        </div>
      </div>
    </main>
  );
}
