import { NextResponse } from "next/server";

// Stack Auth v2 uses a page-based handler, not an API route.
// See: app/[locale]/handler/[...stack]/page.tsx
export function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export function POST() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
