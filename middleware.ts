import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_FILE = /\.(.*)$/;
const locales = ["en", "es"];
const defaultLocale = "en";
const authRequiredRoutes = ["/profile","/onboarding"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignorar rutas públicas
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  // Redirección si falta el idioma
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}`)
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, req.url)
    );
  }

  // Proteger rutas como /en/profile o /es/profile
  const isProtected = authRequiredRoutes.some((route) =>
    pathname.includes(`/${route}`)
  );

  if (isProtected) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const locale =
        locales.find((l) => pathname.startsWith(`/${l}`)) || defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
