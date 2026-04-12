"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

type PaymentItem = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  date: string;
};

type MemberItem = {
  user_id: string;
  display_name: string;
};

export function PaymentAccordion({
  payments,
  members,
  currency,
  tripId,
  isAdmin,
}: {
  payments: PaymentItem[];
  members: MemberItem[];
  currency: string;
  tripId: string;
  isAdmin: boolean;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const memberMap = Object.fromEntries(
    members.map((m) => [m.user_id, m.display_name])
  );

  return (
    <>
      {payments.map((p) => (
        <Card
          key={p.id}
          className="mb-2 !p-3 !border-accent/20"
          onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
        >
          {/* Summary row */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent text-sm shrink-0">
              ✓
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-text-primary">
                  {memberMap[p.from_user_id] ?? "نامشخص"}
                  <span className="text-text-muted mx-1.5">←</span>
                  {memberMap[p.to_user_id] ?? "نامشخص"}
                </span>
                <span className="text-sm font-bold text-accent">
                  {Number(p.amount).toLocaleString()} {currency}
                </span>
              </div>
              <span className="text-[11px] text-text-muted">{p.date}</span>
            </div>
            <span
              className={`text-text-muted text-xs transition-transform ${
                expandedId === p.id ? "rotate-90" : ""
              }`}
            >
              ◂
            </span>
          </div>

          {/* Expanded details */}
          {expandedId === p.id && (
            <div className="mt-3 pt-3 border-t border-border space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">پرداخت‌کننده</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-text-primary">
                    {memberMap[p.from_user_id] ?? "نامشخص"}
                  </span>
                  <Avatar name={memberMap[p.from_user_id] ?? "?"} size={18} />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">دریافت‌کننده</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-text-primary">
                    {memberMap[p.to_user_id] ?? "نامشخص"}
                  </span>
                  <Avatar name={memberMap[p.to_user_id] ?? "?"} size={18} />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">مبلغ</span>
                <span className="text-text-primary font-semibold">
                  {Number(p.amount).toLocaleString()} {currency}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">تاریخ</span>
                <span className="text-text-primary">{p.date}</span>
              </div>

              {isAdmin && (
                <Link
                  href={`/trips/${tripId}/payments/${p.id}/edit`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-1.5 w-full mt-1 py-2 rounded-xl bg-card-hover text-text-muted text-xs font-semibold no-underline hover:bg-border transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M14.167 2.5a2.357 2.357 0 0 1 3.333 3.333L6.25 17.083l-4.583 1.25 1.25-4.583L14.167 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  ویرایش
                </Link>
              )}
            </div>
          )}
        </Card>
      ))}
    </>
  );
}
