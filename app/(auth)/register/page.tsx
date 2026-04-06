import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="glass w-full max-w-md rounded-[2rem] border p-8">
        <h1 className="text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-muted-foreground">Save conversations, switch personas, and sync your AI workspace.</p>
        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
