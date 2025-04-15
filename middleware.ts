import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  if (!session) {
    // If the user is not authenticated and trying to access a protected route
    if (
      req.nextUrl.pathname.startsWith("/dashboard") ||
      (req.nextUrl.pathname.startsWith("/therapist/dashboard") &&
        !req.nextUrl.pathname.includes("/therapist/register") &&
        !req.nextUrl.pathname.includes("/therapist/onboarding"))
    ) {
      const redirectUrl = new URL("/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    // If the user is authenticated, check their user type
    const userType = session.user.user_metadata.user_type

    // Redirect therapists trying to access user dashboard
    if (userType === "therapist" && req.nextUrl.pathname.startsWith("/dashboard")) {
      const redirectUrl = new URL("/therapist/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect users trying to access therapist dashboard
    if (userType === "user" && req.nextUrl.pathname.startsWith("/therapist/dashboard")) {
      const redirectUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Redirect authenticated users away from login/register pages
    if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/therapist/register") {
      const redirectUrl = new URL(userType === "therapist" ? "/therapist/dashboard" : "/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/therapist/dashboard/:path*", "/login", "/onboarding", "/therapist/register"],
}
