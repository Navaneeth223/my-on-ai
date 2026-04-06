import { streamText } from "ai";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { checkOllamaRunning, ollama } from "@/lib/ollama";
import { saveMessage, updateConversationTitle } from "@/lib/memory";
import { prisma } from "@/lib/prisma";
import { scrapePage } from "@/lib/scraper";
import { searchWeb } from "@/lib/search";
import { extractUrls, generateTitle } from "@/lib/utils";
import type { SearchResult } from "@/types";

export const maxDuration = 60;

function shouldSearch(text: string) {
  return /\?$|latest|news|today|current|recent|search|look up/i.test(text);
}

export async function POST(request: NextRequest) {
  try {
    const isRunning = await checkOllamaRunning();
    if (!isRunning) {
      return NextResponse.json(
        {
          error:
            "Ollama is not running. Start Ollama locally and make sure a model like `llama3` is installed.",
        },
        { status: 503 },
      );
    }

    const session = await getServerSession(authOptions);
    const sessionUserId = (session as { user?: { id?: string } } | null)?.user?.id ?? null;
    const body = (await request.json()) as {
      messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
      model?: string;
      systemPrompt?: string;
      temperature?: number;
      searchEnabled?: boolean;
      conversationId?: string;
      fileContent?: string;
    };

    const model = body.model || "llama3";
    const temperature = body.temperature ?? 0.7;
    const messages = body.messages ?? [];
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");

    if (!lastUserMessage?.content) {
      return NextResponse.json({ error: "A user message is required." }, { status: 400 });
    }

    if (!body.conversationId) {
      return NextResponse.json({ error: "Conversation ID is required." }, { status: 400 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: { id: body.conversationId },
    });

    if (!existingConversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    if (sessionUserId !== (existingConversation.userId ?? null)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const sources: SearchResult[] = [];
    const extraContext: string[] = [];

    if (body.searchEnabled && shouldSearch(lastUserMessage.content)) {
      const results = await searchWeb(lastUserMessage.content);
      if (results.length > 0) {
        sources.push(...results);
        extraContext.push(
          "Web search results:\n" +
            results
              .map(
                (result, index) =>
                  `${index + 1}. ${result.title}\nURL: ${result.url}\nSnippet: ${result.snippet}\nContent: ${result.content.slice(0, 1200)}`,
              )
              .join("\n\n"),
        );
      }
    }

    const detectedUrls = extractUrls(lastUserMessage.content);
    if (detectedUrls.length > 0 && /read|summarize|browse|analyze|what does this say/i.test(lastUserMessage.content)) {
      const pages = await Promise.all(detectedUrls.slice(0, 2).map((url) => scrapePage(url)));
      const validPages = pages.filter((page) => page.content);

      if (validPages.length > 0) {
        extraContext.push(
          "Fetched page context:\n" +
            validPages
              .map((page) => `${page.title}\nURL: ${page.url}\n${page.content.slice(0, 2000)}`)
              .join("\n\n"),
        );
      }
    }

    if (body.fileContent) {
      extraContext.push(`Uploaded file content:\n${body.fileContent.slice(0, 8000)}`);
    }

    const systemPrompt = [
      body.systemPrompt ||
        "You are OpenMind AI, a helpful, harmless, honest assistant. When using web or file context, mention the source clearly and stay grounded in the provided material.",
      ...extraContext,
    ]
      .filter(Boolean)
      .join("\n\n");

    let assistantText = "";

    const result = await streamText({
      model: ollama(model),
      temperature,
      system: systemPrompt,
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      onFinish: async ({ text }) => {
        assistantText = text;
        await saveMessage({
          conversationId: body.conversationId!,
          role: "user",
          content: lastUserMessage.content,
          fileData: body.fileContent || null,
        });
        await saveMessage({
          conversationId: body.conversationId!,
          role: "assistant",
          content: text,
          sources: sources.length > 0 ? JSON.stringify(sources) : null,
        });

        const messageCount = await prisma.message.count({
          where: { conversationId: body.conversationId! },
        });

        if (messageCount <= 2) {
          await updateConversationTitle(body.conversationId!, generateTitle(lastUserMessage.content));
        }

        await prisma.conversation.update({
          where: { id: body.conversationId! },
          data: {
            updatedAt: new Date(),
            model,
            systemPrompt: body.systemPrompt,
            temperature,
          },
        });
      },
    });

    const response = result.toDataStreamResponse();

    response.headers.set("x-openmind-sources", encodeURIComponent(JSON.stringify(sources)));
    response.headers.set("x-openmind-model", model);
    if (assistantText) {
      response.headers.set("x-openmind-preview", encodeURIComponent(assistantText.slice(0, 120)));
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to generate a response.",
      },
      { status: 500 },
    );
  }
}
