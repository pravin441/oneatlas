import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getRankings } from "@/lib/services/rankings";

export async function GET(request: NextRequest) {
  const benchmark = request.nextUrl.searchParams.get("benchmark") ?? undefined;
  if (benchmark && !/^[a-z0-9-]{1,60}$/.test(benchmark)) {
    return apiError("INVALID_BENCHMARK", "That benchmark name is not valid.", 400);
  }

  try {
    const result = await getRankings(benchmark || undefined);
    if (benchmark && !result.active) {
      return apiError("NOT_FOUND", `No benchmark found with slug "${benchmark}".`, 404);
    }
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("GET /api/rankings failed:", error);
    return apiError("INTERNAL_ERROR", "Something went wrong on our side.", 500);
  }
}