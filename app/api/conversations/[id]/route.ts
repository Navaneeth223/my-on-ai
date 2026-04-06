import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { deleteConversation } from "@/lib/memory";
import { prisma } from "@/lib/prisma";

function canAccessConversation(userId: string | null | undefined, conversationUserId: string | null) {
  return (userId ?? null) === (conversationUserId ?? null);
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session as { user?: { id?: string } } | null)?.user?.id ?? null;
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    if (!canAccessConversation(sessionUserId, conversation.userId)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    return NextResponse.json({ conversation });
  } catch {
    return NextResponse.json({ error: "Unable to fetch conversation." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session as { user?: { id?: string } } | null)?.user?.id ?? null;
    const existing = await prisma.conversation.findUnique({ where: { id: params.id } });

    if (!existing) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    if (!canAccessConversation(sessionUserId, existing.userId)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const body = (await request.json()) as {
      title?: string;
      pinned?: boolean;
      model?: string;
      systemPrompt?: string;
      temperature?: number;
    };

    const conversation = await prisma.conversation.update({
      where: { id: params.id },
      data: {
        title: body.title,
        pinned: body.pinned,
        model: body.model,
        systemPrompt: body.systemPrompt,
        temperature: body.temperature,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({ conversation });
  } catch {
    return NextResponse.json({ error: "Unable to update conversation." }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session as { user?: { id?: string } } | null)?.user?.id ?? null;
    const existing = await prisma.conversation.findUnique({ where: { id: params.id } });

    if (!existing) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    if (!canAccessConversation(sessionUserId, existing.userId)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    await deleteConversation(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete conversation." }, { status: 500 });
  }
}
