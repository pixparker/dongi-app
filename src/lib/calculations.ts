type BalanceInput = {
  members: { user_id: string }[];
  expenses: { id: string; amount: number; payer_id: string; status: string }[];
  shares: { expense_id: string; user_id: string; share: number }[];
  payments: { from_user_id: string; to_user_id: string; amount: number }[];
};

export type MemberBalance = {
  userId: string;
  totalPaid: number;
  totalShare: number;
  received: number;
  sent: number;
  balance: number;
};

export function calculateMemberBalances({
  members,
  expenses,
  shares,
  payments,
}: BalanceInput): MemberBalance[] {
  const balances: Record<
    string,
    { paid: number; share: number; received: number; sent: number }
  > = {};

  members.forEach((m) => {
    balances[m.user_id] = { paid: 0, share: 0, received: 0, sent: 0 };
  });

  const approved = expenses.filter((e) => e.status === "approved");
  const approvedIds = new Set(approved.map((e) => e.id));

  approved.forEach((e) => {
    if (balances[e.payer_id]) {
      balances[e.payer_id].paid += Number(e.amount);
    }
  });

  shares.forEach((s) => {
    if (approvedIds.has(s.expense_id) && balances[s.user_id]) {
      balances[s.user_id].share += Number(s.share);
    }
  });

  payments.forEach((p) => {
    if (balances[p.from_user_id]) balances[p.from_user_id].sent += Number(p.amount);
    if (balances[p.to_user_id]) balances[p.to_user_id].received += Number(p.amount);
  });

  return members.map((m) => {
    const b = balances[m.user_id];
    return {
      userId: m.user_id,
      totalPaid: b.paid,
      totalShare: b.share,
      received: b.received,
      sent: b.sent,
      balance: b.paid - b.share + b.sent - b.received,
    };
  });
}

export type Settlement = {
  from: string;
  to: string;
  amount: number;
};

export function calculateSettlements(
  memberBalances: MemberBalance[]
): Settlement[] {
  const creditors: { userId: string; amount: number }[] = [];
  const debtors: { userId: string; amount: number }[] = [];

  memberBalances.forEach(({ userId, balance }) => {
    if (balance > 0.01) creditors.push({ userId, amount: balance });
    else if (balance < -0.01) debtors.push({ userId, amount: -balance });
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const transfer = Math.min(creditors[ci].amount, debtors[di].amount);
    if (transfer > 0.01) {
      settlements.push({
        from: debtors[di].userId,
        to: creditors[ci].userId,
        amount: Math.round(transfer * 100) / 100,
      });
    }
    creditors[ci].amount -= transfer;
    debtors[di].amount -= transfer;
    if (creditors[ci].amount < 0.01) ci++;
    if (debtors[di].amount < 0.01) di++;
  }

  return settlements;
}

export function calculateExpenseShares(
  amount: number,
  participantIds: string[],
  splitMode: string,
  customShares?: Record<string, number>
): { userId: string; share: number }[] {
  if (participantIds.length === 0) return [];

  if (splitMode === "equal") {
    const perPerson = Math.round((amount / participantIds.length) * 100) / 100;
    return participantIds.map((uid) => ({ userId: uid, share: perPerson }));
  }

  if (splitMode === "percentage" && customShares) {
    return participantIds.map((uid) => ({
      userId: uid,
      share: Math.round(((amount * (customShares[uid] ?? 0)) / 100) * 100) / 100,
    }));
  }

  if (splitMode === "fixed" && customShares) {
    return participantIds.map((uid) => ({
      userId: uid,
      share: customShares[uid] ?? 0,
    }));
  }

  return [];
}
