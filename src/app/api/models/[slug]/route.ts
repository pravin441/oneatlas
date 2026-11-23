import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getModelBySlug } from "@/lib/services/models";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // params is a Promise in Next.js 16

  if (!/^[a-z0-9-]{1,100}$/.test(slug)) {
    return apiError("INVALID_SLUG", "That model address is not valid.", 400);
  }

  try {
    const model = await getModelBySlug(slug);
    if (!model) {
      return apiError("NOT_FOUND", `No model found with slug "${slug}".`, 404);
    }
    return NextResponse.json({ data: model });
  } catch (error) {
    console.error("GET /api/models/[slug] failed:", error);
    return apiError("INTERNAL_ERROR", "Something went wrong on our side.", 500);
  }
}