import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { listLabs } from "@/lib/services/labs";

export async function GET() {
  try {
    return NextResponse.json({ data: await listLabs() });
  } catch (error) {
    console.error("GET /api/labs failed:", error);
    return apiError("INTERNAL_ERROR", "Something went wrong on our side.", 500);
  }
}