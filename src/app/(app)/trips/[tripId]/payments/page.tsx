import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: trip } = await supabase
    .from("trips")
    .select("currency")
    .eq("id", tripId)
    .single();

  const { data: members } = await supabase
    .from("trip_members")
    .select("user_id, display_name")
    .eq("trip_id", tripId);

  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, amount, payer_id, status")
    .eq("trip_id", tripId)
    .eq("is_deleted", false)
    .eq("status", "approved");

  const expenseIds = expenses?.map((e) => e.id) ?? [];
  let shares: { expense_id: string; user_id: string; share: number }[] = [];
  if (expenseIds.length > 0) {
    const { data } = await supabase
      .from("expense_shares")
      .select("expense_id, user_id, share")
      .in("expense_id", expenseIds);
    shares = data ?? [];
  }

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("trip_id", tripId)
    .eq("is_deleted", false);

  // Calculate balances
  const balances: Record<string, number> = {};
  members?.forEach((m) => {
    balances[m.user_id] = 0;
  });

  expenses?.forEach((e) => {
    if (balances[e.payer_id] !== undefined) {
      balances[e.payer_id] += Number(e.amount);
    }
  });

  shares.forEach((s) => {
    if (balances[s.user_id] !== undefined) {
      balances[s.user_id] -= Number(s.share);
    }
  });

  payments?.forEach((p) => {
    if (balances[p.from_user_id] !== undefined) balances[p.from_user_id] -= Number(p.amount);
    if (balances[p.to_user_id] !== undefined) balances[p.to_user_id] += Number(p.amount);
  });

  // Greedy settlement algorithm
  const creditors: { userId: string; amount: number }[] = [];
  const debtors: { userId: string; amount: number }[] = [];

  Object.entries(balances).forEach(([userId, balance]) => {
    if (balance > 0.01) creditors.push({ userId, amount: balance });
    else if (balance < -0.01) debtors.push({ userId, amount: -balance });
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: { from: string; to: string; amount: number }[] = [];
  let ci = 0,
    di = 0;
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

  const memberMap = Object.fromEntries(
    members?.map((m) => [m.user_id, m.display_name]) ?? []
  );
  const currency = trip?.currency ?? "";

  return (
    <div className="min-h-screen bg-bg flex flex-col direction-rtl">
      <PageHeader title="تسویه حساب" backHref={`/trips/${tripId}`} />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Summary */}
        <div className="bg-accent/8 border border-accent/15 rounded-2xl p-[18px] mb-5 text-center">
          <p className="text-[13px] text-text-muted m-0">
            {settlements.length === 0
              ? "همه تسویه شده‌اند! 🎉"
              : "کمترین تعداد انتقال برای تسویه کامل"}
          </p>
          {settlements.length > 0 && (
            <p className="text-[28px] font-black text-accent mt-1.5 m-0">
              {settlements.length} انتقال
            </p>
          )}
        </div>

        {/* Settlement Cards */}
        {settlements.map((s, i) => (
          <Card key={i} className="mb-2.5 !rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar name={memberMap[s.from] ?? "?"} size={36} />
                <div>
                  <p className="text-[13px] font-semibold text-text-primary m-0">
                    {memberMap[s.from] ?? "نامشخص"}
                  </p>
                  <p className="text-[11px] text-danger m-0">بدهکار</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-base font-extrabold text-accent m-0">
                  {s.amount.toLocaleString()} {currency}
                </p>
                <p className="text-lg text-text-muted m-0">←</p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="text-left">
                  <p className="text-[13px] font-semibold text-text-primary m-0">
                    {memberMap[s.to] ?? "نامشخص"}
                  </p>
                  <p className="text-[11px] text-accent m-0">طلبکار</p>
                </div>
                <Avatar name={memberMap[s.to] ?? "?"} size={36} />
              </div>
            </div>
            <Link
              href={`/trips/${tripId}/payments/new?from=${s.from}&to=${s.to}&amount=${s.amount}`}
              className="block mt-3"
            >
              <Button full variant="secondary" size="sm">
                ثبت پرداخت
              </Button>
            </Link>
          </Card>
        ))}

        {settlements.length === 0 && expenses?.length === 0 && (
          <p className="text-text-muted text-sm text-center py-4">هنوز هزینه‌ای ثبت نشده</p>
        )}
      </div>

      <BottomNav tripId={tripId} />
    </div>
  );
}
