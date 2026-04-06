"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrainCircuit, FileText, Globe2, LockKeyhole } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "Local AI",
    description: "Run powerful open-source models on your own machine with Ollama.",
  },
  {
    icon: Globe2,
    title: "Web Search",
    description: "Blend live search results with grounded responses and citations.",
  },
  {
    icon: FileText,
    title: "File Analysis",
    description: "Upload PDFs, CSVs, JSON, and text files for instant analysis.",
  },
  {
    icon: LockKeyhole,
    title: "Open Source",
    description: "Privacy-first, free forever, and fully deployable on the free tier.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.12),transparent_30%)]" />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-16 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass relative mt-8 rounded-[2rem] border border-white/10 p-8 md:p-12"
        >
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
              OpenMind AI
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              The free, open-source AI assistant that respects your privacy
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Chat, search the web, read documents, and keep your history under your control with local LLMs powered by Ollama.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/chat"
                className="rounded-2xl bg-primary px-6 py-3 text-center font-medium text-primary-foreground transition hover:opacity-90"
              >
                Start Chatting - It&apos;s Free
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-border bg-card/70 px-6 py-3 text-center font-medium transition hover:bg-card"
              >
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass rounded-[1.5rem] border border-white/10 p-6"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
