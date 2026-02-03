// app/api/admin/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));

  const adminPassword = process.env.ADMIN_PASSWORD || "";
  if (!adminPassword) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD manquant dans .env.local" },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json({ ok: false, error: "Mot de passe incorrect" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // cookie simple (httpOnly) pour protéger /admin
  res.cookies.set("rb_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // mets true en https (prod)
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });

  return res;
}
