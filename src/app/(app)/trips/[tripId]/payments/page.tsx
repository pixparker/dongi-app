"use client";

import { use } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import Link from "next/link";

const SETTLEMENTS = [
  { from: "حسین", to: "علی", amount: "۱,۱۵۰" },
  { from: "مریم", to: "علی", amount: "۹۰۰" },
  { from: "مریم", to: "سارا", amount: "۸۵۰" },
];

export default function PaymentsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);

  return (
    <div className="min-h-screen bg-bg flex flex-col direction-rtl">
      <PageHeader title="تسویه حساب" backHref={`/trips/${tripId}`} />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Summary */}
        <div className="bg-accent/8 border border-accent/15 rounded-2xl p-[18px] mb-5 text-center">
          <p className="text-[13px] text-text-muted m-0">
            کمترین تعداد انتقال برای تسویه کامل
          </p>
          <p className="text-[28px] font-black text-accent mt-1.5 m-0">
            ۳ انتقال
          </p>
        </div>

        {/* Settlement Cards */}
        {SETTLEMENTS.map((s, i) => (
          <Card key={i} className="mb-2.5 !rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar name={s.from} size={36} />
                <div>
                  <p className="text-[13px] font-semibold text-text-primary m-0">{s.from}</p>
                  <p className="text-[11px] text-danger m-0">بدهکار</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-base font-extrabold text-accent m-0">
                  {s.amount} ₺
                </p>
                <p className="text-lg text-text-muted m-0">←</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-text-primary m-0">{s.to}</p>
                  <p className="text-[11px] text-accent m-0">طلبکار</p>
                </div>
                <Avatar name={s.to} size={36} />
              </div>
            </div>
            <Link href={`/trips/${tripId}/payments/new`} className="block mt-3">
              <Button full variant="secondary" size="sm">
                ثبت پرداخت
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <BottomNav tripId={tripId} />
    </div>
  );
}
