"use client";

import { useState } from "react";
import { ExpenseListItem } from "./expense-list-item";

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

export function ExpenseAccordion({
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      {expenses.map((e) => (
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
