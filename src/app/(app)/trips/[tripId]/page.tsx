"use client";

import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { PageHeader } from "@/components/ui/page-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import Link from "next/link";
import { use } from "react";

const MEMBERS = [
  { name: "علی", paid: "۵,۲۰۰", share: "۳,۱۵۰", balance: "+۲,۰۵۰", status: "طلبکار" as const },
  { name: "حسین", paid: "۲,۰۰۰", share: "۳,۱۵۰", balance: "-۱,۱۵۰", status: "بدهکار" as const },
  { name: "مریم", paid: "۱,۴۰۰", share: "۳,۱۵۰", balance: "-۱,۷۵۰", status: "بدهکار" as const },
  { name: "سارا", paid: "۳,۸۰۰", share: "۳,۱۵۰", balance: "+۶۵۰", status: "طلبکار" as const },
];

const EXPENSES = [
  { title: "ناهار رستوران", amount: "۳,۲۰۰", payer: "علی", cat: "🍕", status: "approved" as const },
  { title: "بنزین", amount: "۱,۸۰۰", payer: "سارا", cat: "⛽", status: "approved" as const },
  { title: "هتل", amount: "۵,۴۰۰", payer: "حسین", cat: "🏨", status: "pending" as const },
];

export default function TripDashboardPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);

  return (
    <div className="min-h-screen bg-bg flex flex-col direction-rtl">
      <PageHeader
        title="سفر استانبول"
        backHref="/trips"
        rightAction={
          <Link
            href={`/trips/${tripId}/members`}
            className="text-accent text-sm font-semibold no-underline"
          >
            👥 اعضا
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Total Card */}
        <div className="bg-accent/8 border border-accent/20 rounded-[18px] p-5 mb-4 text-center">
          <p className="text-xs text-text-muted mb-1 m-0">مجموع هزینه سفر</p>
          <p className="text-[32px] font-black text-accent tracking-tight m-0">
            ۱۲,۶۰۰
          </p>
          <p className="text-[13px] text-text-muted m-0">₺ لیر ترکیه</p>
          <div className="flex justify-center gap-4 mt-3.5 pt-3.5 border-t border-accent/15">
            <div>
              <p className="text-[11px] text-text-muted m-0">سهم هر نفر</p>
              <p className="text-base font-bold text-text-primary m-0">۳,۱۵۰ ₺</p>
            </div>
            <div className="w-px bg-accent/15" />
            <div>
              <p className="text-[11px] text-text-muted m-0">تعداد اعضا</p>
              <p className="text-base font-bold text-text-primary m-0">۴ نفر</p>
            </div>
          </div>
        </div>

        {/* Members Balance */}
        <h3 className="text-sm font-bold text-text-primary mb-2.5 mt-0">وضعیت اعضا</h3>
        {MEMBERS.map((m) => (
          <Card key={m.name} className="mb-2 !p-3">
            <div className="flex items-center gap-3">
              <Avatar name={m.name} size={38} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-text-primary">{m.name}</span>
                  <StatusPill
                    label={m.status}
                    color={m.status === "طلبکار" ? "var(--color-accent)" : "var(--color-danger)"}
                    bgColor={m.status === "طلبکار" ? "var(--color-accent-soft)" : "var(--color-danger-soft)"}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[11px] text-text-muted">پرداخت: {m.paid} ₺</span>
                  <span
                    className={`text-[13px] font-bold ${
                      m.status === "طلبکار" ? "text-accent" : "text-danger"
                    }`}
                  >
                    {m.balance} ₺
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Recent Expenses */}
        <h3 className="text-sm font-bold text-text-primary mt-4 mb-2.5">هزینه‌های اخیر</h3>
        {EXPENSES.map((e) => (
          <Card key={e.title} className="mb-2 !p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-input-bg flex items-center justify-center text-xl shrink-0">
                {e.cat}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-text-primary">{e.title}</span>
                  <span className="text-sm font-bold text-text-primary">{e.amount} ₺</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[11px] text-text-muted">پرداخت: {e.payer}</span>
                  {e.status === "pending" && (
                    <StatusPill
                      label="در انتظار تایید"
                      color="var(--color-warning)"
                      bgColor="var(--color-warning-soft)"
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
        <div className="h-4" />
      </div>

      <BottomNav tripId={tripId} />
    </div>
  );
}
