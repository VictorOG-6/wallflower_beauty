// app/api/auth/refresh-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  user_id: string;
  sub: string;
  jti: string;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/**
 * POST /api/auth/refresh-token
 * Refreshes the access token using the refresh token
 * Calls your FastAPI /auth/refresh endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Get refresh token from httpOnly cookie
    const refreshTokenCookie = cookieStore.get("refresh_token");

    if (!refreshTokenCookie?.value) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 },
      );
    }

    const refreshToken = refreshTokenCookie.value;

    // Validate refresh token before using it
    try {
      const decoded = jwtDecode<DecodedToken>(refreshToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp <= currentTime) {
        // Token expired, clear cookies
        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");

        return NextResponse.json(
          { error: "Refresh token expired" },
          { status: 401 },
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 },
      );
    }

    // Call your FastAPI refresh endpoint
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${backendUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      // FastAPI returned an error
      const errorData = await response.json().catch(() => ({}));

      // Clear cookies on authentication failure
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");

      return NextResponse.json(
        { error: errorData.detail || "Token refresh failed" },
        { status: response.status },
      );
    }

    const data: RefreshTokenResponse = await response.json();

    // Validate new tokens
    const newAccessDecoded = jwtDecode<DecodedToken>(data.access_token);
    const newRefreshDecoded = jwtDecode<DecodedToken>(data.refresh_token);

    // Set new access token cookie
    cookieStore.set({
      name: "access_token",
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: newAccessDecoded.exp - Math.floor(Date.now() / 1000),
      path: "/",
    });

    // Set new refresh token cookie
    cookieStore.set({
      name: "refresh_token",
      value: data.refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: newRefreshDecoded.exp - Math.floor(Date.now() / 1000),
      path: "/",
    });

    // Return new access token to client (they might need it for axios)
    return NextResponse.json({
      success: true,
      access_token: data.access_token,
      token_type: data.token_type,
    });
  } catch (error) {
    console.error("Token refresh error:", error);

    // Clear cookies on error
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/auth/refresh-token
 * Check if refresh token exists and is valid
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token");

    if (!refreshToken?.value) {
      return NextResponse.json(
        { valid: false, message: "No refresh token found" },
        { status: 401 },
      );
    }

    // Validate token
    try {
      const decoded = jwtDecode<DecodedToken>(refreshToken.value);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp <= currentTime) {
        return NextResponse.json(
          { valid: false, message: "Refresh token expired" },
          { status: 401 },
        );
      }

      return NextResponse.json({
        valid: true,
        expiresAt: decoded.exp,
      });
    } catch (error) {
      return NextResponse.json(
        { valid: false, message: "Invalid refresh token" },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check refresh token" },
      { status: 500 },
    );
  }
}
