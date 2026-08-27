import { NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/types";

const ADMIN_ROLES = new Set<UserRole>(["admin", "staff"]);

type AuthenticatedUser = {
  role?: UserRole;
};

const redirectToSignIn = (request: NextRequest) => {
  return NextResponse.redirect(new URL("/sign-in", request.url));
};

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return redirectToSignIn(request);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return redirectToSignIn(request);
  }

  try {
    const response = await fetch(`${apiUrl}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const redirectResponse = redirectToSignIn(request);
      redirectResponse.cookies.delete("access_token");
      redirectResponse.cookies.delete("refresh_token");
      return redirectResponse;
    }

    const user = (await response.json()) as AuthenticatedUser;

    if (!user.role || !ADMIN_ROLES.has(user.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return redirectToSignIn(request);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
