"use client";

import { useEffect, useMemo, useState } from "react";

type AnyRow = Record<string, any>;

type ApiSuccess = { success: true; data: AnyRow[] };
type ApiFail = { success: false; error: string; hint?: string };
type ApiResponse = ApiSuccess | ApiFail;

function isApiFail(x: ApiResponse): x is ApiFail {
  return x.success === false;
}

function pick(row: AnyRow, keys: string[]) {
  for (const k of keys) {
    if (row?.[k] !== undefined && row?.[k] !== null) return row[k];
  }
  return null;
}

function fmtDate(v: any) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<AnyRow[]>([]);

  // restore key
  useEffect(() => {
    const k = window.localStorage.getItem("ADMIN_API_KEY");
    if (k) {
      setSavedKey(k);
      setAdminKey(k);
    }
  }, []);

  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const url = new URL("/api/admin/requests", window.location.origin);

      // filtres
      if (typeFilter !== "all") url.searchParams.set("type", typeFilter);
      if (statusFilter !== "all") url.searchParams.set("status", statusFilter);
      if (q.trim()) url.searchParams.set("q", q.trim());

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: adminKey ? { "x-admin-key": adminKey } : {},
        cache: "no-store",
      });

      let json: ApiResponse;
      try {
        json = (await res.json()) as ApiResponse;
      } catch {
        json = { success: false, error: "Réponse invalide (JSON)" };
      }

      // ✅ Type narrowing fiable (corrige ton erreur TS)
      if (isApiFail(json)) {
        setErr(json.error || "Erreur inconnue");
        setRows([]);
      } else {
        setRows(Array.isArray(json.data) ? json.data : []);
      }
    } catch (e: any) {
      setErr(e?.message || "Erreur réseau");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  // auto-load au démarrage
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredClientSide = useMemo(() => {
    // (Optionnel) filtrage client-side additionnel si tu veux
    return rows;
  }, [rows]);

  function saveKey() {
    const k = adminKey.trim();
    if (!k) return;
    window.localStorage.setItem("ADMIN_API_KEY", k);
    setSavedKey(k);
  }

  function clearKey() {
    window.localStorage.removeItem("ADMIN_API_KEY");
    setSavedKey(null);
    setAdminKey("");
  }

  // champs “compatibles” avec tes colonnes actuelles (selon tes screenshots)
  function rowType(r: AnyRow) {
    return pick(r, ["request_type", "type"]) ?? "";
  }
  function rowName(r: AnyRow) {
    return pick(r, ["full_name", "name"]) ?? "";
  }
  function rowPhone(r: AnyRow) {
    return pick(r, ["phone", "phone_number"]) ?? "";
  }
  function rowStatus(r: AnyRow) {
    return pick(r, ["status"]) ?? "";
  }
  function rowQuartier(r: AnyRow) {
    return pick(r, ["quartier", "area"]) ?? "";
  }
  function rowMessage(r: AnyRow) {
    return pick(r, ["message", "details"]) ?? "";
  }
  function rowPrice(r: AnyRow) {
    const v = pick(r, ["price", "amount"]);
    return v ?? "";
  }
  function rowCreatedAt(r: AnyRow) {
    return pick(r, ["created_at", "createdAt", "date"]) ?? "";
  }
  function rowNote(r: AnyRow) {
    return pick(r, ["note"]) ?? "";
  }

  return (
    <div style={{ maxWidth: 1100, margin: "24px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>Admin — Demandes</h1>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 14,
          marginBottom: 16,
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ fontWeight: 600 }}>Clé admin</label>
          <input
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="ADMIN_API_KEY"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              minWidth: 320,
            }}
          />
          <button
            onClick={saveKey}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #111827",
              background: "#111827",
              color: "white",
              cursor: "pointer",
            }}
          >
            Sauvegarder
          </button>
          <button
            onClick={clearKey}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "white",
              cursor: "pointer",
            }}
          >
            Effacer
          </button>

          <span style={{ marginLeft: 6, color: "#6b7280" }}>
            {savedKey ? "✅ Clé sauvegardée" : "—"}
          </span>
        </div>

        <hr style={{ margin: "14px 0", borderColor: "#f3f4f6" }} />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ fontWeight: 600 }}>Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #d1d5db" }}
          >
            <option value="all">Tous</option>
            <option value="urgence">urgence</option>
            <option value="regeneration">regeneration</option>
          </select>

          <label style={{ fontWeight: 600 }}>Statut</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #d1d5db" }}
          >
            <option value="all">Tous</option>
            <option value="new">new</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
          </select>

          <label style={{ fontWeight: 600 }}>Recherche</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="tel, quartier, nom..."
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              minWidth: 220,
            }}
          />

          <button
            onClick={load}
            disabled={loading}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #111827",
              background: loading ? "#6b7280" : "#111827",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Chargement..." : "Rafraîchir"}
          </button>
        </div>

        {err && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 10,
              border: "1px solid #fecaca",
              background: "#fff1f2",
              color: "#991b1b",
              fontWeight: 600,
            }}
          >
            Erreur: {err}
          </div>
        )}
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <div style={{ padding: 12, borderBottom: "1px solid #f3f4f6", color: "#374151" }}>
          <b>{filteredClientSide.length}</b> demande(s) — Affichage des 200 dernières demandes (max)
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                {[
                  "Date",
                  "Type",
                  "Téléphone",
                  "Nom",
                  "Prix",
                  "Statut",
                  "Quartier",
                  "Message",
                  "Note",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: 12,
                      borderBottom: "1px solid #e5e7eb",
                      fontSize: 14,
                      background: "#fafafa",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredClientSide.map((r, i) => {
                const createdAt = rowCreatedAt(r);
                const type = rowType(r);
                const phone = rowPhone(r);
                const name = rowName(r);
                const price = rowPrice(r);
                const status = rowStatus(r);
                const quartier = rowQuartier(r);
                const message = rowMessage(r);
                const note = rowNote(r);

                return (
                  <tr key={r.id ?? i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>{fmtDate(createdAt)}</td>
                    <td style={{ padding: 12 }}>{type}</td>
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>{phone}</td>
                    <td style={{ padding: 12 }}>{name}</td>
                    <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                      {price ? `${price} FCFA` : ""}
                    </td>
                    <td style={{ padding: 12 }}>{status}</td>
                    <td style={{ padding: 12 }}>{quartier}</td>
                    <td style={{ padding: 12, maxWidth: 320 }}>{message}</td>
                    <td style={{ padding: 12, maxWidth: 240 }}>{note}</td>
                  </tr>
                );
              })}

              {!loading && filteredClientSide.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 16, color: "#6b7280" }}>
                    Aucune donnée à afficher.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 12, color: "#6b7280", fontSize: 13 }}>
        Astuce: si tu veux sécuriser en prod, mets un vrai <b>ADMIN_API_KEY</b> côté Vercel, et
        enlève le bypass dev.
      </div>
    </div>
  );
}
