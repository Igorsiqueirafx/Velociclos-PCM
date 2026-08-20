import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, {
              ...options,
              path: '/',
            })
          })
        },
      },
    },
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAdminSite = process.env.NEXT_PUBLIC_IS_ADMIN_SITE === 'true'

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)

  const userEmail = session?.user?.email || ''
  const isAdmin = adminEmails.length > 0 && adminEmails.includes(userEmail)

  // ─────────────────────────────────────────────────────────────────
  // ADMIN SITE (velociclosadm.vercel.app)
  // ─────────────────────────────────────────────────────────────────
  if (isAdminSite) {
    const authPaths = ['/auth/login', '/auth/register', '/auth/callback']
    const adminOnlyPaths = ['/dashboard', '/leads', '/download', '/cadastro-lead']

    // Allow auth pages
    if (authPaths.some((path) => request.nextUrl.pathname === path)) {
      // If already authenticated, redirect away from auth pages
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return supabaseResponse
    }

    const isAdminRoute = adminOnlyPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path),
    )

    // Non-admin routes (anything not in adminOnlyPaths) → redirect
    if (!isAdminRoute) {
      const url = request.nextUrl.clone()
      url.pathname = session ? '/dashboard' : '/auth/login'
      return NextResponse.redirect(url)
    }

    // Admin-only routes require authentication
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Non-admin users blocked from admin routes
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return supabaseResponse
  }

  // ─────────────────────────────────────────────────────────────────
  // MAIN SITE (velociclos.vercel.app)
  // ─────────────────────────────────────────────────────────────────
  const protectedPaths = ['/dashboard', '/download', '/leads']
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  )

  // Redirect unauthenticated users on protected paths to login
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Non-admins redirected from /dashboard to home
  if (session && !isAdmin && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // On /download, ensure user has a lead record
  if (session && request.nextUrl.pathname === '/download') {
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', userEmail)
      .maybeSingle()

    if (!lead) {
      return NextResponse.redirect(new URL('/cadastro-lead', request.url))
    }
  }

  // On protected paths, if authenticated and has lead, allow
  // If on a protected page after login but no lead → redirect to cadastro-lead
  if (session && isProtectedPath && request.nextUrl.pathname !== '/cadastro-lead') {
    // Check lead for pages that need it
    const needsLead = ['/download', '/leads', '/dashboard']
    const isNeedsLead = needsLead.some((path) =>
      request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path),
    )

    if (isNeedsLead && isAdmin) {
      // Admins bypass lead check
      return supabaseResponse
    }

    if (isNeedsLead) {
      const { data: lead } = await supabase
        .from('leads')
        .select('id')
        .eq('email', userEmail)
        .maybeSingle()

      if (!lead && request.nextUrl.pathname.startsWith('/cadastro-lead') === false) {
        return NextResponse.redirect(new URL('/cadastro-lead', request.url))
      }
    }
  }

  // Lead capture page requires auth
  if (request.nextUrl.pathname === '/cadastro-lead') {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/download',
    '/leads',
    '/auth/login',
    '/auth/register',
    '/auth/callback',
    '/lead-capture',
    '/cadastro-lead',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
