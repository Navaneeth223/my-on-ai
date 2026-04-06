"use client";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setIsLoading(false);
    if (!result?.error) {
      router.push("/chat");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        className="w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        className="w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
      />
      {searchParams.get("error") ? <p className="text-sm text-rose-400">Invalid login credentials.</p> : null}
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-medium text-primary-foreground"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Sign In
      </button>
      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account? <Link href="/register" className="text-primary">Create one</Link>
      </p>
    </form>
  );
}
