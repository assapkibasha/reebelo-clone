import { NextResponse } from "next/server";
import { listProducts } from "../../../lib/product-service.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const payload = await listProducts();
  return NextResponse.json(payload);
}
