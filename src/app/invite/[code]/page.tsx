"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InvitePage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 direction-rtl">
      <div className="w-full max-w-sm text-center">
        <div className="text-[56px] mb-4">🎒</div>
        <h1 className="text-2xl font-extrabold text-text-primary mb-2">
          دعوت به سفر
        </h1>
        <p className="text-text-muted text-sm mb-2">
          شما به <span className="text-accent font-bold">سفر استانبول</span> دعوت شده‌اید
        </p>
        <p className="text-text-muted text-xs mb-8">
          👥 ۴ عضو · 💰 ۱۲,۶۰۰ ₺
        </p>

        <Button full size="lg" className="mb-3">
          پیوستن به سفر
        </Button>

        <Link href="/login">
          <Button full variant="secondary" size="md">
            ابتدا وارد شوید
          </Button>
        </Link>
      </div>
    </div>
  );
}
