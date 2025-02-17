import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.AUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // /dashboard and any subpaths (Not technically needed since we use matcher too)
  const dashboardPathRegex = /^\/dashboard(\/.*)?$/;

  // If the user isn't logged in, and the path matches the regex
  if (!session && dashboardPathRegex.test(pathname)) {
    const url = new URL("/", req.url); // Redirect to the root page
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Continue as usual
}

export const config = {
  matcher: [
    // /dashboard and any subpath
    "/dashboard/:path*",
  ],
};
