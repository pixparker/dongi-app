"use client";

import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
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

        <InputField label="نام کاربری" placeholder="مثلاً: ali_traveler" icon="👤" />
        <InputField label="رمز عبور" placeholder="••••••••" type="password" icon="🔒" />

        <Button full size="lg" className="mt-2">
          ورود
        </Button>

        <div className="my-5 text-text-muted text-[13px]">─── یا ───</div>

        <Link href="/register">
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
