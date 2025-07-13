import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/landing", "/blog", "/auth/login"];

function getLocale(pathname: string): string | null {
  const match = pathname.match(/^\/(es|en)(\/|$)/);
  return match?.[1] || null;
}

function getPathWithoutLocale(pathname: string): string {
  return pathname.replace(/^\/(es|en)/, "") || "/";
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ✅ Redirige rutas sin locale al default "/en"
  const locale = getLocale(pathname);
  if (!locale) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  // ✅ Redirige "/" a "/en" (por consistencia)
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/en";
    return NextResponse.redirect(url);
  }

  const pathWithoutLocale = getPathWithoutLocale(pathname);

  // ✅ Permitir rutas públicas
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathWithoutLocale === p || pathWithoutLocale.startsWith(p + "/")
  );
  if (isPublic) return NextResponse.next();

  // 🛡️ Verificar sesión
  const token = await getToken({ req });
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = `/${locale}/auth/login`;
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|_next/static|favicon.ico|.*\\..*).*)"],
};
