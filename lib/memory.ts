import { prisma } from "@/lib/prisma";
import { generateTitle } from "@/lib/utils";

export async function saveMessage(input: {
  conversationId: string;
  role: string;
  content: string;
  sources?: string | null;
  fileData?: string | null;
}) {
  const message = await prisma.message.create({
    data: input,
  });

  await prisma.conversation.update({
    where: { id: input.conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function getConversationMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createConversation(input: {
  userId?: string | null;
  title?: string;
  model?: string;
  systemPrompt?: string | null;
  temperature?: number;
}) {
  return prisma.conversation.create({
    data: {
      userId: input.userId ?? null,
      title: input.title ?? "New Chat",
      model: input.model ?? "llama3",
      systemPrompt: input.systemPrompt,
      temperature: input.temperature ?? 0.7,
    },
    include: {
      messages: true,
    },
  });
}

export async function updateConversationTitle(conversationId: string, title?: string) {
  return prisma.conversation.update({
    where: { id: conversationId },
    data: {
      title: title ? generateTitle(title) : "New Chat",
    },
  });
}

export async function deleteConversation(conversationId: string) {
  return prisma.conversation.delete({
    where: { id: conversationId },
  });
}

export async function getUserConversations(userId?: string | null) {
  return prisma.conversation.findMany({
    where: {
      userId: userId ?? null,
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  });
}
