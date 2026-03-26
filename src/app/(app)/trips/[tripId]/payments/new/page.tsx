"use client";

import { use } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { PageHeader } from "@/components/ui/page-header";

export default function NewPaymentPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="ثبت پرداخت" backHref={`/trips/${tripId}/payments`} />

      <div className="px-5 pb-6">
        <p className="text-[13px] text-text-muted text-center mb-6">
          پرداخت مستقیم بین دو نفر
        </p>

        {/* From -> To */}
        <div className="flex items-center justify-center gap-4 mb-7">
          <div className="text-center">
            <Avatar name="حسین" size={56} />
            <p className="mt-1.5 mb-0 text-[13px] font-semibold text-text-primary">حسین</p>
            <p className="m-0 text-[11px] text-text-muted">پرداخت‌کننده</p>
          </div>
          <div className="text-[28px] text-accent">←</div>
          <div className="text-center">
            <Avatar name="علی" size={56} />
            <p className="mt-1.5 mb-0 text-[13px] font-semibold text-text-primary">علی</p>
            <p className="m-0 text-[11px] text-text-muted">دریافت‌کننده</p>
          </div>
        </div>

        {/* Amount */}
        <div className="text-center mb-7">
          <label className="block text-xs font-semibold text-text-muted mb-2">
            مبلغ پرداخت
          </label>
          <div className="bg-input-bg rounded-[18px] py-6 px-4 border border-border">
            <span className="text-[44px] font-black text-accent">۱,۱۵۰</span>
            <span className="text-lg text-text-muted mr-2">₺</span>
          </div>
        </div>

        <InputField label="توضیحات (اختیاری)" placeholder="مثلاً: تسویه نقدی" icon="📝" />

        <Button full size="lg">
          ثبت پرداخت ✓
        </Button>
      </div>
    </div>
  );
}
