import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";

import { ChatWindow } from "@/components/chat/ChatWindow";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ChatPage({ params }: { params: { chatId: string } }) {
  const session = await getServerSession(authOptions);
  const sessionUserId = (session as { user?: { id?: string } } | null)?.user?.id ?? null;
  const conversation = await prisma.conversation.findUnique({
    where: { id: params.chatId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    notFound();
  }

  if (conversation.userId && !session) {
    redirect("/login");
  }

  if ((conversation.userId ?? null) !== sessionUserId && conversation.userId !== null) {
    redirect("/chat");
  }

  return (
    <ChatWindow
      conversationId={conversation.id}
      initialMessages={conversation.messages.map((message) => ({
        id: message.id,
        role: message.role as "user" | "assistant" | "system",
        content: message.content,
        sources: message.sources ? JSON.parse(message.sources) : null,
        fileData: message.fileData ? JSON.parse(message.fileData) : null,
        createdAt: message.createdAt.toISOString(),
      }))}
    />
  );
}
