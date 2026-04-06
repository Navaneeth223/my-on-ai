import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!body.email || !body.password || body.password.length < 8) {
      return NextResponse.json({ error: "Valid name, email, and password are required." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const password = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: {
        name: body.name?.trim() || null,
        email: body.email.toLowerCase(),
        password,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Unable to register account." }, { status: 500 });
  }
}
