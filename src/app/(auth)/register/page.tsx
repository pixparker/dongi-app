"use client";

import { Suspense, useActionState } from "react";
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
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(
    (_prev, formData) => register(formData),
    {}
  );

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 direction-rtl">
      <div className="w-full max-w-sm text-center">
        <div className="text-[56px] mb-2">🎒</div>
        <h1 className="text-[32px] font-black text-accent tracking-tight mb-1.5">
          ساخت حساب
        </h1>
        <p className="text-text-muted text-sm mb-9">
          به دنگی‌سفر خوش آمدید
        </p>

        <form action={formAction}>
          <input type="hidden" name="redirect" value={redirectTo} />
          <InputField
            label="نام کاربری"
            name="username"
            placeholder="یک نام کاربری انتخاب کنید"
            icon="👤"
            required
            minLength={3}
          />
          <InputField
            label="رمز عبور"
            name="password"
            placeholder="••••••••"
            type="password"
            icon="🔒"
            required
            minLength={6}
          />
          <InputField
            label="تکرار رمز عبور"
            name="confirmPassword"
            placeholder="••••••••"
            type="password"
            icon="🔒"
            required
          />

          {state.error && (
            <p className="text-danger text-sm mb-3">{state.error}</p>
          )}

          <Button full size="lg" className="mt-2" disabled={pending}>
            {pending ? "..." : "ثبت‌نام"}
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
