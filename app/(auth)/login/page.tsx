"use client";

import { Github, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);

  async function handleOAuth(provider: "google" | "github") {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl: "/chat" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="glass w-full max-w-md rounded-[2rem] border p-8">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">Sign in to sync conversations, personas, and settings.</p>
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3"
          >
            <Mail className="h-4 w-4" />
            {oauthLoading === "google" ? "Connecting..." : "Continue with Google"}
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("github")}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3"
          >
            <Github className="h-4 w-4" />
            {oauthLoading === "github" ? "Connecting..." : "Continue with GitHub"}
          </button>
        </div>
        <div className="my-6 h-px bg-border" />
        <Suspense fallback={<div className="rounded-2xl border border-border bg-card/60 px-4 py-3 text-sm text-muted-foreground">Loading sign in form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
