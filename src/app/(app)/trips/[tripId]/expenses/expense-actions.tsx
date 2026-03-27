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
      <Link href={`/trips/${tripId}/expenses/${expenseId}/edit`}>
        <Button variant="secondary" size="sm">
          ویرایش ✏️
        </Button>
      </Link>
    </div>
  );
}
