"use client";

import { use } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { BottomNav } from "@/components/layout/bottom-nav";

const LOGS = [
  { action: "ایجاد", detail: "هزینه «ناهار رستوران» ثبت شد", user: "علی", time: "۱۰ دقیقه پیش", icon: "🟢" },
  { action: "تایید", detail: "هزینه «هتل» تایید شد", user: "علی (ادمین)", time: "۲۵ دقیقه پیش", icon: "✅" },
  { action: "ویرایش", detail: "مبلغ «بنزین» از ۱,۵۰۰ به ۱,۸۰۰ تغییر کرد", user: "سارا", time: "۱ ساعت پیش", icon: "🔵" },
  { action: "حذف", detail: "هزینه «خرید سوغاتی» حذف شد", user: "علی (ادمین)", time: "۲ ساعت پیش", icon: "🔴" },
  { action: "پرداخت", detail: "حسین ← علی: ۵۰۰ ₺", user: "حسین", time: "۳ ساعت پیش", icon: "💸" },
  { action: "عضویت", detail: "سارا به سفر پیوست", user: "سارا", time: "دیروز", icon: "👋" },
];

export default function HistoryPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);

  return (
    <div className="min-h-screen bg-bg flex flex-col direction-rtl">
      <PageHeader title="تاریخچه تغییرات" backHref={`/trips/${tripId}`} />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {LOGS.map((log, i) => (
          <div
            key={i}
            className={`flex gap-3 py-3.5 ${
              i < LOGS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="text-lg pt-0.5">{log.icon}</div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-text-primary m-0">{log.detail}</p>
              <div className="flex gap-2.5 mt-1">
                <span className="text-[11px] text-text-muted">👤 {log.user}</span>
                <span className="text-[11px] text-text-muted">⏰ {log.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav tripId={tripId} />
    </div>
  );
}
