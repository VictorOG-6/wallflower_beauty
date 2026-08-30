// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  user_id: string;
  sub: string;
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

    // Validate tokens
    const accessDecoded = jwtDecode<DecodedToken>(accessToken);
    const refreshDecoded = jwtDecode<DecodedToken>(refreshToken);

    const cookieStore = await cookies();

    // Set access token cookie
    cookieStore.set({
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessDecoded.exp - Math.floor(Date.now() / 1000),
      path: "/",
    });

    // Set refresh token cookie
    cookieStore.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshDecoded.exp - Math.floor(Date.now() / 1000),
      path: "/",
    });

    return NextResponse.json({ success: true });
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
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 },
    );
  }
}
