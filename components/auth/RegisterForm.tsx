"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to register.");
      return;
    }
    setSuccess("Account created. Redirecting to login...");
    window.setTimeout(() => router.push("/login"), 1200);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={form.name}
        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        placeholder="Name"
        className="w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
      />
      <input
        type="email"
        value={form.email}
        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        placeholder="Email"
        className="w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
      />
      <input
        type="password"
        value={form.password}
        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        placeholder="Password"
        className="w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
      />
      <input
        type="password"
        value={form.confirmPassword}
        onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
        placeholder="Confirm password"
        className="w-full rounded-2xl border border-border bg-card/70 px-4 py-3 outline-none"
      />
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-400">{success}</p> : null}
      <button className="w-full rounded-2xl bg-primary px-5 py-3 font-medium text-primary-foreground">Create Account</button>
      <p className="text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="text-primary">Sign in</Link>
      </p>
    </form>
  );
}
