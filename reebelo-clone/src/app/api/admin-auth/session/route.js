import { NextResponse } from "next/server";
import { getAdminSession, isAdminAuthConfigured } from "../../../../lib/admin-auth.js";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    authenticated: await getAdminSession(),
    configured: isAdminAuthConfigured(),
  });
}
