import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session as { user?: { id?: string } } | null)?.user?.id;
    if (!sessionUserId) {
      return NextResponse.json({ personas: [] });
    }

    const personas = await prisma.persona.findMany({
      where: { userId: sessionUserId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ personas });
  } catch {
    return NextResponse.json({ error: "Unable to fetch personas." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session as { user?: { id?: string } } | null)?.user?.id;
    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      description?: string;
      systemPrompt?: string;
    };

    if (!body.name || !body.description || !body.systemPrompt) {
      return NextResponse.json({ error: "All persona fields are required." }, { status: 400 });
    }

    const persona = await prisma.persona.create({
      data: {
        name: body.name,
        description: body.description,
        systemPrompt: body.systemPrompt,
        userId: sessionUserId,
      },
    });

    return NextResponse.json({ persona }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create persona." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session as { user?: { id?: string } } | null)?.user?.id;
    if (!sessionUserId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Persona ID is required." }, { status: 400 });
    }

    await prisma.persona.deleteMany({
      where: { id, userId: sessionUserId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete persona." }, { status: 500 });
  }
}
