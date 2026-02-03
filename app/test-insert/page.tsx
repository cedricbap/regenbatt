"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function TestInsert() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function insertOne() {
    setLoading(true);
    setResult("Insertion en cours...");

    const payload = {
      request_type: "urgence",
      phone: "070000000",
      full_name: "Test Insert",
      lat: 0.35,
      lng: 9.49,
      price_estimated: 10000,
      status: "new",
      symptoms: ["Test insertion"],
    };

    const res = await supabase.from("requests").insert(payload).select();

    if (res.error) {
      console.error(res.error);
      setResult("❌ ERREUR : " + res.error.message);
    } else {
      const id = res.data?.[0]?.id;
      setResult("✅ INSERT OK — ID = " + (id ?? "(id non retourné)"));
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow space-y-4">
        <h1 className="text-xl font-bold">Test Insert Supabase</h1>

        <button
          onClick={insertOne}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? "Insertion..." : "Insérer une demande test"}
        </button>

        <pre className="text-sm bg-gray-50 p-2 rounded whitespace-pre-wrap">
          {result}
        </pre>
      </div>
    </main>
  );
}
