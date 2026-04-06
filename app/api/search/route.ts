import { NextRequest, NextResponse } from "next/server";

import { searchWeb } from "@/lib/search";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { query?: string };
    if (!body.query?.trim()) {
      return NextResponse.json({ error: "Query is required." }, { status: 400 });
    }

    const results = await searchWeb(body.query);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Unable to complete search." }, { status: 500 });
  }
}
