import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { createConversation, getUserConversations } from "@/lib/memory";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session as { user?: { id?: string } } | null)?.user?.id ?? null;
    const conversations = await getUserConversations(sessionUserId);
    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json({ error: "Unable to fetch conversations." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session as { user?: { id?: string } } | null)?.user?.id ?? null;
    const body = (await request.json().catch(() => ({}))) as {
      model?: string;
      systemPrompt?: string;
      temperature?: number;
      title?: string;
    };

    const conversation = await createConversation({
      userId: sessionUserId,
      model: body.model,
      systemPrompt: body.systemPrompt,
      temperature: body.temperature,
      title: body.title,
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create conversation." }, { status: 500 });
  }
}
