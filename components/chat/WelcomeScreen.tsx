"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

const prompts = [
  "Explain quantum computing in simple terms",
  "Write a Python script to sort a list of dictionaries",
  "What are the latest trends in AI for 2024?",
  "Help me write a professional email to my manager",
  "Analyze the pros and cons of remote work",
  "Create a workout plan for beginners",
];

export function WelcomeScreen({
  model,
  onPromptClick,
}: {
  model: string;
  onPromptClick: (prompt: string) => void;
}) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-10 text-center">
      <div className="rounded-[2rem] bg-primary/10 p-5 text-primary">
        <Bot className="h-10 w-10" />
      </div>
      <h2 className="mt-6 text-3xl font-semibold">Welcome to OpenMind AI</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Ask anything, search the web, upload a document, or paste a link to browse it with your current model: <span className="text-foreground">{model}</span>.
      </p>
      <div className="mt-8 grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">
        {prompts.map((prompt, index) => (
          <motion.button
            key={prompt}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onPromptClick(prompt)}
            className="rounded-[1.5rem] border border-border bg-card/60 p-4 text-left transition hover:border-primary/40 hover:bg-card"
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
