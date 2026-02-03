import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          RechargBatt
        </h1>

        <p className="text-center text-gray-600">
          Jump start d’urgence • Régénération batterie 12V (atelier)
        </p>

        <Link
          href="/urgence"
          className="block w-full bg-red-600 text-white text-center py-5 rounded-xl text-xl font-semibold shadow hover:bg-red-700 transition"
        >
          🚨 Batterie à plat (Urgence)
        </Link>

        <Link
          href="/regeneration"
          className="block w-full bg-green-600 text-white text-center py-5 rounded-xl text-xl font-semibold shadow hover:bg-green-700 transition"
        >
          🔋 Régénération batterie (Derrière la pédiatrie) — 8000 FCFA
        </Link>

        <Link href="/contact" className="block text-center text-gray-700 underline">
          À propos & Contact
        </Link>
      </div>
    </main>
  );
}
