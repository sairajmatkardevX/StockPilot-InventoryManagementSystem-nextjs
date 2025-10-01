import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { nextUrl } = req;
    const token = req.nextauth.token;

    // Redirect logged-in users away from login
    if (token && nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/inventory/:path*",
    "/products/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/login",
  ],
};
