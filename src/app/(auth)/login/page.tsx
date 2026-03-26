"use client";

import { Suspense, useActionState } from "react";
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
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(
    (_prev, formData) => login(formData),
    {}
  );

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

        <form action={formAction}>
          <input type="hidden" name="redirect" value={redirectTo} />
          <InputField
            label="نام کاربری"
            name="username"
            placeholder="مثلاً: ali_traveler"
            icon="👤"
            required
          />
          <InputField
            label="رمز عبور"
            name="password"
            placeholder="••••••••"
            type="password"
            icon="🔒"
            required
          />

          {state.error && (
            <p className="text-danger text-sm mb-3">{state.error}</p>
          )}

          <Button full size="lg" className="mt-2" disabled={pending}>
            {pending ? "..." : "ورود"}
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
      </div>
    </div>
  );
}
