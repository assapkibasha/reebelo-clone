import { NextResponse } from "next/server";
import { getAdminSession } from "../../../lib/admin-auth.js";
import { createProduct, deleteProduct, listProducts, updateProduct } from "../../../lib/product-service.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: "Admin login required." }, { status: 401 });
    }

    const product = await createProduct(await request.formData());
    const payload = await listProducts();

    return NextResponse.json({ product, ...payload }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: "Admin login required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    await deleteProduct(searchParams.get("id"));
    const payload = await listProducts();

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    if (!(await getAdminSession())) {
      return NextResponse.json({ error: "Admin login required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const product = await updateProduct(searchParams.get("id"), await request.formData());
    const payload = await listProducts();

    return NextResponse.json({ product, ...payload });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
