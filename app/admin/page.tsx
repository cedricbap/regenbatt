"use client";

import { useEffect, useMemo, useState } from "react";

type AnyRow = Record<string, any>;

type ApiResponse =
  | { success: true; data: AnyRow[] }
  | { success: false; error: string; hint?: string };

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
      url.searchParams.set("type", typeFilter);
      url.searchParams.set("status", statusFilter);
      url.searchParams.set("q", q);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: adminKey ? { "x-admin-key": adminKey } : {},
        cache: "no-store",
      });

      const json = (await res.json()) as ApiResponse;

      if (!json.success) {
        setErr(json.error || "Erreur inconnue");
        setRows([]);
      } else {
        setRows(json.data || []);
      }
    } catch (e: any) {
      setErr(e?.message || "Erreur réseau");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // auto-load on first render
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveKey() {
    const k = adminKey.trim();
    if (!k) {
      window.localStorage.removeItem("ADMIN_API_KEY");
      setSavedKey(null);
      return;
    }
    window.localStorage.setItem("ADMIN_API_KEY", k);
    setSavedKey(k);
  }

  const filteredClientSide = useMemo(() => {
    // On refiltre côté client au cas où (utile si backend renvoie tout)
    const qq = q.trim().toLowerCase();

    return rows.filter((r) => {
      const typeVal = String(
        pick(r, ["request_type", "type", "service_type"]) ?? ""
      ).toLowerCase();

      const statusVal = String(pick(r, ["status"]) ?? "").toLowerCase();

      const phoneVal = String(pick(r, ["phone", "tel", "telephone"]) ?? "");
      const nameVal = String(pick(r, ["full_name", "name", "client_name"]) ?? "");
      const quartierVal = String(pick(r, ["quartier", "neighborhood", "zone"]) ?? "");
      const msgVal = String(pick(r, ["message", "note_client", "symptoms"]) ?? "");
      const noteVal = String(pick(r, ["note"]) ?? "");

      const hay = `${phoneVal} ${nameVal} ${quartierVal} ${msgVal} ${noteVal}`.toLowerCase();

      if (typeFilter !== "all" && typeVal !== typeFilter.toLowerCase()) return false;
      if (statusFilter !== "all" && statusVal !== statusFilter.toLowerCase()) return false;
      if (qq && !hay.includes(qq)) return false;
      return true;
    });
  }, [rows, q, typeFilter, statusFilter]);

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <a href="/" style={{ color: "#2563eb", textDecoration: "none" }}>
        ← Retour
      </a>

      <h1 style={{ fontSize: 42, margin: "10px 0" }}>Admin — Demandes</h1>
      <p style={{ marginTop: 0, color: "#6b7280" }}>
        Liste des demandes enregistrées (via API server).
      </p>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 16,
          margin: "18px 0",
          background: "#fff",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 12 }}>
          <div>
            <label style={{ fontWeight: 600 }}>Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ width: "100%", height: 42, borderRadius: 12, border: "1px solid #d1d5db", padding: "0 12px" }}
            >
              <option value="all">Tous</option>
              <option value="urgence">urgence</option>
              <option value="regeneration">regeneration</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: "100%", height: 42, borderRadius: 12, border: "1px solid #d1d5db", padding: "0 12px" }}
            >
              <option value="all">Tous</option>
              <option value="new">new</option>
              <option value="contacted">contacted</option>
              <option value="confirmed">confirmed</option>
              <option value="done">done</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Recherche</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Téléphone, nom, quartier, message, note…"
              style={{ width: "100%", height: 42, borderRadius: 12, border: "1px solid #d1d5db", padding: "0 12px" }}
            />
          </div>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={load}
            disabled={loading}
            style={{
              height: 44,
              padding: "0 18px",
              borderRadius: 14,
              border: "1px solid #111827",
              background: "#111827",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "Chargement..." : "Actualiser"}
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 420 }}>
              <label style={{ fontWeight: 600 }}>Clé Admin (optionnel)</label>
              <input
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="(facultatif en dev si bypass activé)"
                style={{
                  width: "100%",
                  height: 42,
                  borderRadius: 12,
                  border: "1px solid #d1d5db",
                  padding: "0 12px",
                }}
              />
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                En prod, tu peux exiger <code>x-admin-key</code>. En dev, la route peut bypass.
                {savedKey ? " (clé enregistrée)" : ""}
              </div>
            </div>

            <button
              onClick={saveKey}
              style={{
                height: 44,
                padding: "0 18px",
                borderRadius: 14,
                border: "1px solid #111827",
                background: "white",
                fontWeight: 700,
                cursor: "pointer",
                marginTop: 18,
              }}
            >
              Enregistrer
            </button>
          </div>
        </div>

        {err && (
          <div
            style={{
              marginTop: 14,
              border: "1px solid #fecaca",
              background: "#fef2f2",
              color: "#b91c1c",
              borderRadius: 14,
              padding: 12,
              whiteSpace: "pre-wrap",
            }}
          >
            {err}
          </div>
        )}
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 14, color: "#6b7280" }}>
          {filteredClientSide.length} demande(s) — Affichage des 200 dernières demandes (max)
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: 12 }}>Date</th>
                <th style={{ textAlign: "left", padding: 12 }}>Type</th>
                <th style={{ textAlign: "left", padding: 12 }}>Téléphone</th>
                <th style={{ textAlign: "left", padding: 12 }}>Nom</th>
                <th style={{ textAlign: "left", padding: 12 }}>Prix</th>
                <th style={{ textAlign: "left", padding: 12 }}>Statut</th>
                <th style={{ textAlign: "left", padding: 12 }}>Quartier</th>
                <th style={{ textAlign: "left", padding: 12 }}>Message</th>
                <th style={{ textAlign: "left", padding: 12 }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientSide.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: 18, color: "#6b7280" }}>
                    Aucune demande.
                  </td>
                </tr>
              ) : (
                filteredClientSide.map((r, i) => {
                  const created = pick(r, ["created_at", "createdAt", "date"]);
                  const type = pick(r, ["request_type", "type", "service_type"]);
                  const phone = pick(r, ["phone", "tel", "telephone"]);
                  const name = pick(r, ["full_name", "name", "client_name"]);
                  const price = pick(r, ["price_estimated", "price", "amount"]);
                  const status = pick(r, ["status"]);
                  const quartier = pick(r, ["quartier", "neighborhood", "zone"]);
                  const message = pick(r, ["message", "msg", "client_message"]);
                  const note = pick(r, ["note"]);

                  return (
                    <tr key={r.id ?? i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: 12, whiteSpace: "nowrap" }}>{fmtDate(created)}</td>
                      <td style={{ padding: 12 }}>{type ?? ""}</td>
                      <td style={{ padding: 12, whiteSpace: "nowrap" }}>{phone ?? ""}</td>
                      <td style={{ padding: 12 }}>{name ?? ""}</td>
                      <td style={{ padding: 12, whiteSpace: "nowrap" }}>
                        {price !== null && price !== undefined ? `${price} FCFA` : ""}
                      </td>
                      <td style={{ padding: 12 }}>{status ?? ""}</td>
                      <td style={{ padding: 12 }}>{quartier ?? ""}</td>
                      <td style={{ padding: 12, maxWidth: 320 }}>{message ?? ""}</td>
                      <td style={{ padding: 12, maxWidth: 240 }}>{note ?? ""}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div style={{ padding: 14, color: "#6b7280", fontSize: 12 }}>
          Notes = usage interne (pas visible client). Statuts = workflow (new → contacted → confirmed → done).
          Admin via API = compatible avec RLS (Service Role côté serveur).
        </div>
      </div>
    </main>
  );
}
