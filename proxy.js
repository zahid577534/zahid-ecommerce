// proxy.js

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/auth/logout") return NextResponse.next();

  try {
    const tokenCookie = request.cookies.get("access_token");
    const hasToken = !!tokenCookie;

    // 🔐 Not logged in
    if (!hasToken) {
      if (pathname.startsWith("/admin") || pathname.startsWith("/my-account")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
      return NextResponse.next();
    }

    // 🔐 Verify token
    const { payload } = await jwtVerify(
      tokenCookie.value,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    const role = payload.role;

    // 🔁 Redirect logged-in users away from login/register
    if (pathname === "/auth/login" || pathname === "/auth/register") {
      return NextResponse.redirect(
        new URL(
          role === "admin" ? "/admin/dashboard" : "/my-account",
          request.url
        )
      );
    }

    // 🔐 Role protection
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/my-account/:path*",
    "/auth/login",
    "/auth/register",
  ],
};