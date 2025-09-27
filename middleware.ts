import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Define routes that should skip authentication
  const publicDashboardRoutes = ["/dashboard/preview"];

  // Check if the current path should skip auth
  const shouldSkipAuth = publicDashboardRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (shouldSkipAuth) {
    return res;
  }

  // For all other dashboard routes, require authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
