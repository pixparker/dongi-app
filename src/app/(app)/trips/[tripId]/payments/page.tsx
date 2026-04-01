import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { calculateMemberBalances, calculateSettlements } from "@/lib/calculations";
import { currencySymbol } from "@/lib/constants";

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

  // Calculate balances and settlements using shared logic
  const memberBalances = calculateMemberBalances({
    members: members ?? [],
    expenses: expenses ?? [],
    shares,
    payments: payments ?? [],
  });

  const settlements = calculateSettlements(memberBalances);

  const memberMap = Object.fromEntries(
    members?.map((m) => [m.user_id, m.display_name]) ?? []
  );
  const currency = currencySymbol(trip?.currency ?? "");

  return (
    <>
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
    </>
  );
}
