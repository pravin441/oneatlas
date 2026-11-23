import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { listModels } from "@/lib/services/models";
import { modelQuerySchema } from "@/lib/validators/models";

export async function GET(request: NextRequest) {
  // Read the query string and ignore empty values like "?q="
  const raw = Object.fromEntries(
    [...request.nextUrl.searchParams.entries()].filter(([, v]) => v.trim() !== "")
  );

  const parsed = modelQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return apiError(
      "INVALID_QUERY",
      "One or more query parameters are invalid.",
      400,
      parsed.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }))
    );
  }

  try {
    const result = await listModels(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/models failed:", error);
    return apiError("INTERNAL_ERROR", "Something went wrong on our side.", 500);
  }
}