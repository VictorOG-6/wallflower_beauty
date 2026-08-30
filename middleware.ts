import { NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/types";
import { getAuthCookieOptions, resolveAuthSession } from "@/lib/server-auth";

const ADMIN_ROLES = new Set<UserRole>(["admin", "staff"]);

const redirectToSignIn = (request: NextRequest, clearCookies = false) => {
  const response = NextResponse.redirect(new URL("/sign-in", request.url));

  if (clearCookies) {
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
  }

  return response;
};

export async function middleware(request: NextRequest) {
  const session = await resolveAuthSession({
    access_token: request.cookies.get("access_token")?.value,
    refresh_token: request.cookies.get("refresh_token")?.value,
  });

  if (!session.user) {
    const hasAuthCookie = Boolean(
      request.cookies.get("access_token")?.value ||
        request.cookies.get("refresh_token")?.value,
    );

    return redirectToSignIn(request, hasAuthCookie);
  }

  if (!ADMIN_ROLES.has(session.user.role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();

  if (session.tokens) {
    response.cookies.set({
      name: "access_token",
      value: session.tokens.access_token,
      ...getAuthCookieOptions(session.tokens.access_token),
    });
    response.cookies.set({
      name: "refresh_token",
      value: session.tokens.refresh_token,
      ...getAuthCookieOptions(session.tokens.refresh_token),
    });
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
