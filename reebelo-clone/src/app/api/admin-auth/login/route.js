import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminToken, isAdminAuthConfigured, verifyAdminCredentials } from "../../../../lib/admin-auth.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json({ error: "Admin login is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const username = String(body.username || "");
  const password = String(body.password || "");

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(ADMIN_COOKIE, createAdminToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
