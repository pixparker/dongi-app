"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { login, type AuthResult } from "../actions";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set("username", username);
    formData.set("password", password);
    formData.set("redirect", redirectTo);

    const result: AuthResult = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 direction-rtl">
      <div className="w-full max-w-sm text-center">
        <div className="text-[56px] mb-2">🎒</div>
        <h1 className="text-[32px] font-black text-accent tracking-tight mb-1.5">
          دنگی‌سفر
        </h1>
        <p className="text-text-muted text-sm mb-9">
          مدیریت هزینه سفرهای گروهی
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="نام کاربری"
            name="username"
            placeholder="مثلاً: ali_traveler"
            icon="👤"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <InputField
            label="رمز عبور"
            name="password"
            placeholder="••••••••"
            type="password"
            icon="🔒"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-danger text-sm mb-3">{error}</p>
          )}

          <Button full size="lg" className="mt-2" disabled={loading}>
            {loading ? "..." : "ورود"}
          </Button>
        </form>

        <div className="my-5 text-text-muted text-[13px]">─── یا ───</div>

        <Link href={`/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}>
          <Button full variant="secondary" size="md">
            ساخت حساب جدید
          </Button>
        </Link>

        <p className="text-text-muted text-[11px] mt-8">
          نسخه PWA · نصب روی هر دستگاهی
        </p>
        <p className="text-text-muted/50 text-[10px] mt-2">
          v{process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0"}
        </p>
      </div>
    </div>
  );
}
