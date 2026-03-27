"use client";

import { useState } from "react";
import { ExpenseListItem } from "@/components/expenses/expense-list-item";

const FILTERS = [
  { id: "all", label: "همه" },
  { id: "approved", label: "تایید شده" },
  { id: "pending", label: "در انتظار" },
  { id: "rejected", label: "رد شده" },
];

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

export function FilterableExpenseList({
  expenses,
  shares,
  members,
  currency,
  tripId,
  isAdmin,
}: {
  expenses: ExpenseItem[];
  shares: ShareItem[];
  members: MemberItem[];
  currency: string;
  tripId: string;
  isAdmin: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    filter === "all" ? expenses : expenses.filter((e) => e.status === filter);

  // Count per status for badge
  const counts: Record<string, number> = {};
  expenses.forEach((e) => {
    counts[e.status] = (counts[e.status] || 0) + 1;
  });

  return (
    <>
      {/* Quick filter */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const count = f.id === "all" ? expenses.length : (counts[f.id] ?? 0);
          if (f.id !== "all" && count === 0) return null;
          return (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); setExpandedId(null); }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-all border-none flex items-center gap-1.5 ${
                filter === f.id
                  ? "bg-accent text-bg"
                  : "bg-input-bg text-text-muted"
              }`}
            >
              {f.label}
              <span className={`text-[10px] ${filter === f.id ? "text-bg/70" : "text-text-muted/60"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-text-muted text-sm text-center py-8">هزینه‌ای یافت نشد</p>
      )}

      {filtered.map((e) => (
        <ExpenseListItem
          key={e.id}
          expense={e}
          shares={shares}
          members={members}
          currency={currency}
          tripId={tripId}
          isAdmin={isAdmin}
          expanded={expandedId === e.id}
          onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)}
        />
      ))}
    </>
  );
}
