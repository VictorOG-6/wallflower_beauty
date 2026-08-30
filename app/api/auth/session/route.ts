// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { getAuthCookieOptions } from "@/lib/server-auth";

interface DecodedToken {
  exp: number;
  user_id: string;
  sub: string;
}

function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  response.cookies.set({
    name: "access_token",
    value: accessToken,
    ...getAuthCookieOptions(accessToken),
  });
  response.cookies.set({
    name: "refresh_token",
    value: refreshToken,
    ...getAuthCookieOptions(refreshToken),
  });
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = await request.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Tokens are required" },
        { status: 400 },
      );
    }

    jwtDecode<DecodedToken>(accessToken);
    jwtDecode<DecodedToken>(refreshToken);

    const response = NextResponse.json({ success: true });
    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}

// DELETE route for logout
export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 },
    );
  }
}
