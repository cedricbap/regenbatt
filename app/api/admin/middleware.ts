// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // on protège toutes les routes /admin*
  if (pathname.startsWith("/admin")) {
    const isLogged = req.cookies.get("rb_admin")?.value === "1";
    if (!isLogged) {
      // autorise quand même l'accès à /admin (page login) mais elle ne verra pas les data
      // -> on redirige vers /admin (qui est la login page)
      // si tu veux séparer, fais /admin/login
      // Ici: on laisse la page /admin s'afficher, elle gèrera l'état via /api/admin/me
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
