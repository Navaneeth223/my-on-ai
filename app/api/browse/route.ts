import { NextRequest, NextResponse } from "next/server";

import { scrapePage } from "@/lib/scraper";
import { isValidUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { url?: string };
    if (!body.url || !isValidUrl(body.url)) {
      return NextResponse.json({ error: "A valid URL is required." }, { status: 400 });
    }

    const page = await scrapePage(body.url);
    return NextResponse.json({ page });
  } catch {
    return NextResponse.json({ error: "Unable to browse the provided URL." }, { status: 500 });
  }
}
