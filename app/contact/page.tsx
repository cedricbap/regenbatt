import Link from "next/link";

export default function ContactPage() {
  const whatsappNumber = "24177189379"; // 🔴 remplace par TON numéro (sans +)

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto w-full max-w-md space-y-4">
        <Link href="/" className="text-sm text-gray-600 underline">
          ← Retour
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">
          ℹ️ À propos & Contact
        </h1>

        <div className="rounded-xl bg-white p-4 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-800">RechargBatt</h2>
          <p className="text-sm text-gray-700">
            Service mobile de <strong>jump start</strong> et de
            <strong> régénération de batteries auto 12V</strong> à Libreville
            et environs.
          </p>

          <ul className="text-sm text-gray-700 space-y-1">
            <li>✅ Intervention rapide</li>
            <li>✅ Diagnostic avant / après</li>
            <li>✅ Prix clairs</li>
            <li>✅ Service sur place ou en atelier</li>
          </ul>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm space-y-2">
          <p className="text-sm">
            📍 <strong>Zones couvertes</strong> : Libreville, Akanda, Owendo
          </p>
          <p className="text-sm">
            ⏰ <strong>Horaires</strong> : 7j/7 – 7h à 22h
          </p>
          <p className="text-sm">
            📞 <strong>Téléphone</strong> : {whatsappNumber}
          </p>
        </div>

        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          className="block w-full rounded-xl bg-green-600 py-3 text-white text-center text-lg font-bold shadow active:scale-95 transition"
        >
          Contacter sur WhatsApp 💬
        </a>

        <p className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} RechargBatt – Tous droits réservés
        </p>
      </div>
    </main>
  );
}
