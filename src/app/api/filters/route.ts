import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getFilterOptions } from "@/lib/services/models";

export async function GET() {
  try {
    const data = await getFilterOptions();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/filters failed:", error);
    return apiError("INTERNAL_ERROR", "Something went wrong on our side.", 500);
  }
}