import { jwtDecode } from "jwt-decode";
import type { UserRole } from "@/types";

interface DecodedToken {
  exp: number;
}

export interface AuthCookies {
  access_token?: string;
  refresh_token?: string;
}

export interface AuthSessionResult {
  user: { role: UserRole } | null;
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
}

function getApiUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;
}

function getCookieMaxAge(token: string): number {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return Math.max(decoded.exp - Math.floor(Date.now() / 1000), 0);
  } catch {
    return 0;
  }
}

export function getAuthCookieOptions(token: string) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: getCookieMaxAge(token),
    path: "/",
  };
}

async function refreshTokens(
  refreshToken: string,
): Promise<{ access_token: string; refresh_token: string } | null> {
  const apiUrl = getApiUrl();
  if (!apiUrl) return null;

  try {
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) return null;

    return response.json();
  } catch {
    return null;
  }
}

async function fetchUser(
  accessToken: string,
): Promise<{ role?: UserRole } | null> {
  const apiUrl = getApiUrl();
  if (!apiUrl) return null;

  try {
    const response = await fetch(`${apiUrl}/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!response.ok) return null;

    return response.json();
  } catch {
    return null;
  }
}

export async function resolveAuthSession(
  cookies: AuthCookies,
): Promise<AuthSessionResult> {
  if (!getApiUrl()) {
    return { user: null };
  }

  let refreshedTokens: AuthSessionResult["tokens"];
  const accessToken = cookies.access_token;

  if (accessToken) {
    const user = await fetchUser(accessToken);
    if (user?.role) {
      return { user: { role: user.role } };
    }
  }

  const refreshToken = cookies.refresh_token;
  if (!refreshToken) {
    return { user: null };
  }

  const tokens = await refreshTokens(refreshToken);
  if (!tokens) {
    return { user: null };
  }

  refreshedTokens = tokens;

  const user = await fetchUser(tokens.access_token);
  if (!user?.role) {
    return { user: null, tokens: refreshedTokens };
  }

  return { user: { role: user.role }, tokens: refreshedTokens };
}
