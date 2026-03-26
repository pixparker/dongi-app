"use client";

import { use } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";

const EXPENSES = [
  { title: "ناهار رستوران", amount: "۳,۲۰۰", payer: "علی", cat: "🍕", date: "۱۴۰۵/۰۱/۱۶", status: "approved" as const },
  { title: "بنزین", amount: "۱,۸۰۰", payer: "سارا", cat: "⛽", date: "۱۴۰۵/۰۱/۱۶", status: "approved" as const },
  { title: "هتل", amount: "۵,۴۰۰", payer: "حسین", cat: "🏨", date: "۱۴۰۵/۰۱/۱۵", status: "pending" as const },
  { title: "خرید سوغاتی", amount: "۲,۲۰۰", payer: "مریم", cat: "🛍️", date: "۱۴۰۵/۰۱/۱۵", status: "approved" as const },
];

export default function ExpensesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="هزینه‌ها" backHref={`/trips/${tripId}`} />

      <div className="px-5 pb-6">
        {EXPENSES.map((e, i) => (
          <Card key={i} className="mb-2 !p-3">
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
                  <span className="text-[11px] text-text-muted">پرداخت: {e.payer} · {e.date}</span>
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

        <Link href={`/trips/${tripId}/expenses/new`} className="block mt-4">
          <Button full size="lg">
            + ثبت هزینه جدید
          </Button>
        </Link>
      </div>
    </div>
  );
}
