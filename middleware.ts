/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuth } from "@/service/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define employer-only routes
  const employerRoutes = [
    "/employer",
    "/api/company",
    "/api/jobs"
  ];

  // Check if the current path is an employer route
  const isEmployerRoute = employerRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If it's an employer route, verify authentication and role
  if (isEmployerRoute) {
    try {
      const session = await verifyAuth(request);

      // If no session, redirect to sign-in
      if (!session) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
      }

      // If user is not an employer, redirect to home with specific error
      if (session.role !== "employer") {
        const homeUrl = new URL("/", request.url);
        homeUrl.searchParams.set("error", "user_not_employer");
        homeUrl.searchParams.set("userRole", session.role || "user");
        return NextResponse.redirect(homeUrl);
      }

      // For API routes, verify the user has a company (except for company creation)
      if (pathname.startsWith("/api/company/job") || pathname.startsWith("/api/jobs")) {
        // You could add additional company verification here if needed
        // For now, we'll let the API routes handle their own company checks
      }

    } catch (error) {
      console.error("Middleware auth error:", error);
      const signInUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // For non-employer routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};