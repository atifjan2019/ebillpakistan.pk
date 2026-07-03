import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Redirect every request arriving on the bare (non-www) host to the canonical
// www host, preserving the full path and query string.
//
// Status 308 (Permanent Redirect) is used instead of 301 because 308 guarantees
// the original HTTP method is preserved on the redirected request — important for
// any future form POSTs.
//
// ⚠️  VERCEL DASHBOARD ACTION REQUIRED before deploying:
//     Vercel Dashboard → your project → Domains
//     • Make sure "www.ebillpakistan.pk" is listed as the PRIMARY domain.
//     • Remove (or do not add) any Vercel-level redirect from www → non-www.
//     If Vercel still has a www→non-www domain-level redirect active, it will
//     fight this middleware and produce an infinite redirect loop.
//     Once Vercel's domain redirect is removed, this middleware is the single
//     source of truth for canonicalisation.
export function middleware(request: NextRequest) {
  // Strip any port suffix (present in local dev: "localhost:3000")
  const host = (request.headers.get('host') ?? '').replace(/:\d+$/, '')

  if (host === 'ebillpakistan.pk') {
    const url = request.nextUrl.clone()
    url.host = 'www.ebillpakistan.pk'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  // Run on all user-facing routes.
  // Exclude the Next.js static asset pipeline (_next/static, _next/image) to
  // avoid redundant middleware overhead on immutable asset fetches — browsers
  // and bots never request those from the wrong host once the HTML is correct.
  matcher: ['/((?!_next/static|_next/image).*)'],
}
