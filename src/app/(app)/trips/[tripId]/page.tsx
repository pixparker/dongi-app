import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { PageHeader } from "@/components/ui/page-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { calculateMemberBalances } from "@/lib/calculations";
import { currencySymbol } from "@/lib/constants";
import { ExpenseApprovalButtons } from "./expenses/expense-actions";
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { ExpenseAccordion } from "@/components/expenses/expense-accordion";

const CATEGORY_ICONS: Record<string, string> = {
  food: "🍕",
  transport: "⛽",
  accommodation: "🏨",
  entertainment: "🎭",
  shopping: "🛍️",
  other: "📦",
};

export default async function TripDashboardPage({
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

  // Fetch trip
  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (!trip) notFound();

  // Fetch members
  const { data: members } = await supabase
    .from("trip_members")
    .select("*")
    .eq("trip_id", tripId);

  // Fetch approved, non-deleted expenses
  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("trip_id", tripId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  // Fetch expense shares for these expenses
  const expenseIds = expenses?.map((e) => e.id) ?? [];
  let shares: { expense_id: string; user_id: string; share: number }[] = [];
  if (expenseIds.length > 0) {
    const { data } = await supabase
      .from("expense_shares")
      .select("expense_id, user_id, share")
      .in("expense_id", expenseIds);
    shares = data ?? [];
  }

  // Fetch non-deleted payments
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("trip_id", tripId)
    .eq("is_deleted", false);

  // Calculate balances using shared logic
  const approvedExpenses = expenses?.filter((e) => e.status === "approved") ?? [];
  const totalExpenses = approvedExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const memberCount = members?.length ?? 0;

  const balanceResults = calculateMemberBalances({
    members: members ?? [],
    expenses: expenses ?? [],
    shares,
    payments: payments ?? [],
  });

  const memberBalances = (members ?? []).map((m) => {
    const b = balanceResults.find((r) => r.userId === m.user_id);
    return {
      ...m,
      paid: b?.totalPaid ?? 0,
      share: b?.totalShare ?? 0,
      balance: b?.balance ?? 0,
      status: (b?.balance ?? 0) >= 0 ? ("طلبکار" as const) : ("بدهکار" as const),
    };
  });

  const currentMember = members?.find((m) => m.user_id === user.id);
  const isAdmin = currentMember?.role === "creator" || currentMember?.role === "admin";
  const pendingExpenses = (expenses ?? []).filter((e) => e.status === "pending");
  const recentExpenses = (expenses ?? []).slice(0, 5);

  return (
    <div className="min-h-screen bg-bg flex flex-col direction-rtl">
      <PageHeader
        title={trip.name}
        backHref="/trips"
        rightAction={
          <div className="flex items-center gap-3">
            <Link
              href={`/trips/${tripId}/settings`}
              className="text-text-muted text-lg no-underline"
            >
              ⚙️
            </Link>
            <Link
              href={`/trips/${tripId}/members`}
              className="text-accent text-sm font-semibold no-underline"
            >
              👥 اعضا
            </Link>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Total Card */}
        <div className="bg-accent/8 border border-accent/20 rounded-[18px] p-5 mb-4 text-center">
          <p className="text-xs text-text-muted mb-1 m-0">مجموع هزینه سفر</p>
          <p className="text-[32px] font-black text-accent tracking-tight m-0">
            {totalExpenses.toLocaleString()}
          </p>
          <p className="text-[13px] text-text-muted m-0">{currencySymbol(trip.currency)}</p>
          <div className="flex justify-center gap-4 mt-3.5 pt-3.5 border-t border-accent/15">
            <div>
              <p className="text-[11px] text-text-muted m-0">سهم هر نفر</p>
              <p className="text-base font-bold text-text-primary m-0">
                {memberCount > 0 ? Math.round(totalExpenses / memberCount).toLocaleString() : 0} {currencySymbol(trip.currency)}
              </p>
            </div>
            <div className="w-px bg-accent/15" />
            <div>
              <p className="text-[11px] text-text-muted m-0">تعداد اعضا</p>
              <p className="text-base font-bold text-text-primary m-0">{memberCount} نفر</p>
            </div>
          </div>
        </div>

        {/* Members Balance */}
        <h3 className="text-sm font-bold text-text-primary mb-2.5 mt-0">وضعیت اعضا</h3>
        {memberBalances.map((m) => (
          <Card key={m.id} className="mb-2 !p-3">
            <div className="flex items-center gap-3">
              <Avatar name={m.display_name} size={38} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-text-primary">{m.display_name}</span>
                  <StatusPill
                    label={m.status}
                    color={m.status === "طلبکار" ? "var(--color-accent)" : "var(--color-danger)"}
                    bgColor={m.status === "طلبکار" ? "var(--color-accent-soft)" : "var(--color-danger-soft)"}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[11px] text-text-muted">پرداخت: {m.paid.toLocaleString()} {currencySymbol(trip.currency)}</span>
                  <span
                    className={`text-[13px] font-bold ${
                      m.status === "طلبکار" ? "text-accent" : "text-danger"
                    }`}
                  >
                    {m.balance >= 0 ? "+" : ""}{m.balance.toLocaleString()} {currencySymbol(trip.currency)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Category Breakdown */}
        {approvedExpenses.length > 0 && (
          <ExpensePieChart
            expenses={approvedExpenses.map((e) => ({ category: e.category, amount: Number(e.amount) }))}
            currency={trip.currency}
          />
        )}

        {/* Pending Expenses for Admin */}
        {isAdmin && pendingExpenses.length > 0 && (
          <>
            <div className="flex items-center gap-2 mt-4 mb-2.5">
              <h3 className="text-sm font-bold text-text-primary m-0">در انتظار تایید</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--color-warning-soft)", color: "var(--color-warning)" }}>
                {pendingExpenses.length}
              </span>
            </div>
            {pendingExpenses.map((e) => {
              const payer = members?.find((m) => m.user_id === e.payer_id);
              return (
                <Card key={e.id} className="mb-2 !p-3 border-warning/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-input-bg flex items-center justify-center text-xl shrink-0">
                      {CATEGORY_ICONS[e.category] ?? "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-text-primary">{e.title}</span>
                        <span className="text-sm font-bold text-text-primary">
                          {Number(e.amount).toLocaleString()} {currencySymbol(trip.currency)}
                        </span>
                      </div>
                      <span className="text-[11px] text-text-muted">
                        پرداخت: {payer?.display_name ?? "نامشخص"}
                      </span>
                    </div>
                  </div>
                  <ExpenseApprovalButtons tripId={tripId} expenseId={e.id} />
                </Card>
              );
            })}
          </>
        )}

        <h3 className="text-sm font-bold text-text-primary mt-4 mb-2.5">هزینه‌های اخیر</h3>
        {recentExpenses.length === 0 && (
          <p className="text-text-muted text-sm text-center py-4">هنوز هزینه‌ای ثبت نشده</p>
        )}
        <ExpenseAccordion
          expenses={recentExpenses.map((e) => ({ ...e, amount: Number(e.amount) }))}
          shares={shares}
          members={members?.map((m) => ({ user_id: m.user_id, display_name: m.display_name })) ?? []}
          currency={currencySymbol(trip.currency)}
          tripId={tripId}
          isAdmin={isAdmin}
        />
        <div className="h-4" />
      </div>

      <BottomNav tripId={tripId} />
    </div>
  );
}
