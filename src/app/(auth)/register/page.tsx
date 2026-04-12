"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { register, type AuthResult } from "../actions";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set("display_name", displayName);
    formData.set("username", username);
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);
    formData.set("redirect", redirectTo);

    const result: AuthResult = await register(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-bg flex flex-col items-center justify-center px-6 direction-rtl">
      <div className="w-full max-w-sm text-center">
        <div className="text-[56px] mb-2">🎒</div>
        <h1 className="text-[32px] font-black text-accent tracking-tight mb-1.5">
          ساخت حساب
        </h1>
        <p className="text-text-muted text-sm mb-9">
          به دنگی‌سفر خوش آمدید
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="نام نمایشی"
            name="display_name"
            placeholder="مثلاً: علی، حسین، مریم"
            icon="😊"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <InputField
            label="نام کاربری (برای ورود)"
            name="username"
            placeholder="یک نام کاربری انتخاب کنید"
            icon="👤"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
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
            minLength={6}
          />
          <InputField
            label="تکرار رمز عبور"
            name="confirmPassword"
            placeholder="••••••••"
            type="password"
            icon="🔒"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-danger text-sm mb-3">{error}</p>
          )}

          <Button full size="lg" className="mt-2" disabled={loading}>
            {loading ? "..." : "ثبت‌نام"}
          </Button>
        </form>

        <div className="mt-6 text-text-muted text-[13px]">
          قبلاً حساب دارید؟{" "}
          <Link href={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="text-accent font-semibold">
            ورود
          </Link>
        </div>
      </div>
    </div>
  );
}
