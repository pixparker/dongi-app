"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { approveExpense } from "./actions";

export function ExpenseApprovalButtons({
  tripId,
  expenseId,
}: {
  tripId: string;
  expenseId: string;
}) {
  return (
    <div className="flex gap-1.5 mt-2">
      <Button
        variant="primary"
        size="sm"
        onClick={async () => {
          await approveExpense(tripId, expenseId);
        }}
      >
        تایید ✓
      </Button>
      <Link
        href={`/trips/${tripId}/expenses/${expenseId}/edit`}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-card-hover text-text-muted text-xs font-semibold no-underline hover:bg-border transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M14.167 2.5a2.357 2.357 0 0 1 3.333 3.333L6.25 17.083l-4.583 1.25 1.25-4.583L14.167 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        ویرایش
      </Link>
    </div>
  );
}
