import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { currencySymbol } from "@/lib/constants";
import { FilterableExpenseList } from "./filterable-expense-list";

export default async function ExpensesPage({
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
    .select("user_id, display_name, role")
    .eq("trip_id", tripId);

  const currentMember = members?.find((m) => m.user_id === user.id);
  const isAdmin = currentMember?.role === "creator" || currentMember?.role === "admin";

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .eq("trip_id", tripId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  const expenseIds = expenses?.map((e) => e.id) ?? [];
  let shares: { expense_id: string; user_id: string; share: number }[] = [];
  if (expenseIds.length > 0) {
    const { data } = await supabase
      .from("expense_shares")
      .select("expense_id, user_id, share")
      .in("expense_id", expenseIds);
    shares = data ?? [];
  }

  const currency = currencySymbol(trip?.currency ?? "");

  return (
    <>
      <PageHeader title="هزینه‌ها" backHref={`/trips/${tripId}`} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <FilterableExpenseList
          expenses={(expenses ?? []).map((e) => ({ ...e, amount: Number(e.amount) }))}
          shares={shares}
          members={members?.map((m) => ({ user_id: m.user_id, display_name: m.display_name })) ?? []}
          currency={currency}
          tripId={tripId}
          isAdmin={isAdmin}
        />

        <Link href={`/trips/${tripId}/expenses/new`} className="block mt-4">
          <Button full size="lg">
            + ثبت هزینه جدید
          </Button>
        </Link>
      </div>
    </>
  );
}
