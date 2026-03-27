"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const CATEGORY_ICONS: Record<string, string> = {
  food: "🍕",
  transport: "⛽",
  accommodation: "🏨",
  entertainment: "🎭",
  shopping: "🛍️",
  other: "📦",
};

const CATEGORY_NAMES: Record<string, string> = {
  food: "غذا",
  transport: "حمل‌ونقل",
  accommodation: "اقامت",
  entertainment: "تفریح",
  shopping: "خرید",
  other: "سایر",
};

const SPLIT_LABELS: Record<string, string> = {
  equal: "مساوی",
  percentage: "درصدی",
  fixed: "مبلغ ثابت",
};

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  payer_id: string;
  category: string;
  date: string;
  description?: string | null;
  split_mode: string;
  status: string;
};

type ShareItem = {
  expense_id: string;
  user_id: string;
  share: number;
};

type MemberItem = {
  user_id: string;
  display_name: string;
};

export function ExpenseListItem({
  expense,
  shares,
  members,
  currency,
  tripId,
  isAdmin,
  expanded,
  onToggle,
}: {
  expense: ExpenseItem;
  shares: ShareItem[];
  members: MemberItem[];
  currency: string;
  tripId: string;
  isAdmin: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isRejected = expense.status === "rejected";
  const payer = members.find((m) => m.user_id === expense.payer_id);
  const expenseShares = shares.filter((s) => s.expense_id === expense.id);

  return (
    <Card
      className={`mb-2 !p-3 ${isRejected ? "opacity-50" : ""}`}
      onClick={onToggle}
    >
      {/* Summary row */}
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-input-bg flex items-center justify-center text-xl shrink-0">
          {CATEGORY_ICONS[expense.category] ?? "📦"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <span className={`text-sm font-semibold ${isRejected ? "text-text-muted line-through" : "text-text-primary"}`}>
              {expense.title}
            </span>
            <span className={`text-sm font-bold ${isRejected ? "text-text-muted" : "text-text-primary"}`}>
              {expense.amount.toLocaleString()} {currency}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[11px] text-text-muted">
              پرداخت: {payer?.display_name ?? "نامشخص"}
            </span>
            {expense.status === "pending" && (
              <StatusPill label="در انتظار تایید" color="var(--color-warning)" bgColor="var(--color-warning-soft)" />
            )}
            {isRejected && (
              <StatusPill label="رد شده" color="var(--color-danger)" bgColor="var(--color-danger-soft)" />
            )}
          </div>
        </div>
        <span className={`text-text-muted text-xs transition-transform ${expanded ? "rotate-90" : ""}`}>
          ◂
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">دسته‌بندی</span>
            <span className="text-text-primary">{CATEGORY_NAMES[expense.category] ?? expense.category}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">تاریخ</span>
            <span className="text-text-primary">{expense.date}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-muted">نحوه تقسیم</span>
            <span className="text-text-primary">{SPLIT_LABELS[expense.split_mode] ?? expense.split_mode}</span>
          </div>
          {expense.description && (
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">توضیحات</span>
              <span className="text-text-primary">{expense.description}</span>
            </div>
          )}

          {/* Shares breakdown */}
          {expenseShares.length > 0 && (
            <div>
              <p className="text-[11px] text-text-muted mb-1.5">سهم هر نفر:</p>
              {expenseShares.map((s) => {
                const member = members.find((m) => m.user_id === s.user_id);
                return (
                  <div key={s.user_id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <Avatar name={member?.display_name ?? "?"} size={22} />
                      <span className="text-xs text-text-primary">{member?.display_name ?? "نامشخص"}</span>
                    </div>
                    <span className="text-xs font-semibold text-text-primary">
                      {s.share.toLocaleString()} {currency}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Edit button for admin */}
          {isAdmin && (
            <Link
              href={`/trips/${tripId}/expenses/${expense.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="block"
            >
              <Button full variant="secondary" size="sm">
                ویرایش ✏️
              </Button>
            </Link>
          )}
        </div>
      )}
    </Card>
  );
}
