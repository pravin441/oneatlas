import { NextResponse } from "next/server";

// Every error from our API has the same shape, so the frontend can
// handle errors in one place.
export function apiError(
  code: string,
  message: string,
  status: number,
  details?: unknown
) {
  return NextResponse.json(
    { error: { code, message, ...(details ? { details } : {}) } },
    { status }
  );
}