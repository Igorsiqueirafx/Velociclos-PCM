import { auth } from "@/app/lib/auth/config"

export default auth((req: {
  auth: { user?: { email?: string | null } } | null,
  nextUrl: URL,
}) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  const isOnAuth = req.nextUrl.pathname.startsWith("/auth")

  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", req.nextUrl))
  }

  if (isOnAuth && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl))
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}