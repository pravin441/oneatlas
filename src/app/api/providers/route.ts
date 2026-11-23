import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { listProviders } from "@/lib/services/providers";

export async function GET() {
  try {
    return NextResponse.json({ data: await listProviders() });
  } catch (error) {
    console.error("GET /api/providers failed:", error);
    return apiError("INTERNAL_ERROR", "Something went wrong on our side.", 500);
  }
}