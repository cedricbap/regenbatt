// app/api/admin/me/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const isLogged = req.cookies.get("rb_admin")?.value === "1";
  return NextResponse.json({ ok: true, isLogged });
}
