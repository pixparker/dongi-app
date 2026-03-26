"use client";

import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
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

        <InputField label="نام کاربری" placeholder="یک نام کاربری انتخاب کنید" icon="👤" />
        <InputField label="رمز عبور" placeholder="••••••••" type="password" icon="🔒" />
        <InputField label="تکرار رمز عبور" placeholder="••••••••" type="password" icon="🔒" />

        <Button full size="lg" className="mt-2">
          ثبت‌نام
        </Button>

        <div className="mt-6 text-text-muted text-[13px]">
          قبلاً حساب دارید؟{" "}
          <Link href="/login" className="text-accent font-semibold">
            ورود
          </Link>
        </div>
      </div>
    </div>
  );
}
