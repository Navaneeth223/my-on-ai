import { NextResponse } from "next/server";

import { checkOllamaRunning, getModels } from "@/lib/ollama";

export async function GET() {
  try {
    const isRunning = await checkOllamaRunning();
    if (!isRunning) {
      return NextResponse.json({ models: [], isRunning: false });
    }

    const models = await getModels();
    return NextResponse.json({ models, isRunning: true });
  } catch {
    return NextResponse.json({ models: [], isRunning: false });
  }
}
