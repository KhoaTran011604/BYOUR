import { updateSession } from "@/lib/supabase/proxy"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { locales, defaultLocale } from "@/i18n/config"

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  if (locales.includes(potentialLocale as any)) {
    return potentialLocale
  }
  return null
}

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().substring(0, 2))

    for (const locale of preferredLocales) {
      if (locales.includes(locale as any)) {
        return locale
      }
    }
  }
  return defaultLocale
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip locale handling for API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return await updateSession(request)
  }

  const localeFromPath = getLocaleFromPath(pathname)

  // If no locale in path and not default locale preference, redirect
  if (!localeFromPath) {
    const preferredLocale = getPreferredLocale(request)

    // For default locale, don't add prefix (localePrefix: 'as-needed' behavior)
    if (preferredLocale !== defaultLocale) {
      const url = request.nextUrl.clone()
      url.pathname = `/${preferredLocale}${pathname}`
      return NextResponse.redirect(url)
    }

    // Rewrite to default locale internally
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.rewrite(url)
  }

  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
