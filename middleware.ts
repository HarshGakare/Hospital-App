// import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

// Protects every /admin/* route except the login page itself.
const { auth } = NextAuth(authConfig);


export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdmin = req.auth?.user && (req.auth.user as { role?: string }).role === "admin";
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isProtected = pathname.startsWith("/admin") && !isLoginPage;

  if (isProtected && (!isLoggedIn || !isAdmin)) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (isLoginPage && isLoggedIn && isAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
