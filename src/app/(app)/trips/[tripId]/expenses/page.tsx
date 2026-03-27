import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { currencySymbol } from "@/lib/constants";
import { ExpenseApprovalButtons } from "./expense-actions";

const CATEGORY_ICONS: Record<string, string> = {
  food: "🍕",
  transport: "⛽",
  accommodation: "🏨",
  entertainment: "🎭",
  shopping: "🛍️",
  other: "📦",
};

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

  const memberMap = Object.fromEntries(
    members?.map((m) => [m.user_id, m.display_name]) ?? []
  );

  const currency = currencySymbol(trip?.currency ?? "");

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="هزینه‌ها" backHref={`/trips/${tripId}`} />

      <div className="px-5 pb-6">
        {expenses?.length === 0 && (
          <p className="text-text-muted text-sm text-center py-8">هنوز هزینه‌ای ثبت نشده</p>
        )}

        {expenses?.map((e) => {
          const cardContent = (
            <Card key={e.id} className={`mb-2 !p-3 ${e.status === "rejected" ? "opacity-50" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-input-bg flex items-center justify-center text-xl shrink-0">
                  {CATEGORY_ICONS[e.category] ?? "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-semibold ${e.status === "rejected" ? "text-text-muted line-through" : "text-text-primary"}`}>
                      {e.title}
                    </span>
                    <span className={`text-sm font-bold ${e.status === "rejected" ? "text-text-muted" : "text-text-primary"}`}>
                      {Number(e.amount).toLocaleString()} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[11px] text-text-muted">
                      پرداخت: {memberMap[e.payer_id] ?? "نامشخص"} · {e.date}
                    </span>
                    {e.status === "pending" && (
                      <StatusPill
                        label="در انتظار تایید"
                        color="var(--color-warning)"
                        bgColor="var(--color-warning-soft)"
                      />
                    )}
                    {e.status === "rejected" && (
                      <StatusPill
                        label="رد شده"
                        color="var(--color-danger)"
                        bgColor="var(--color-danger-soft)"
                      />
                    )}
                  </div>
                </div>
              </div>
              {isAdmin && e.status === "pending" && (
                <ExpenseApprovalButtons tripId={tripId} expenseId={e.id} />
              )}
            </Card>
          );

          if (isAdmin) {
            return (
              <Link key={e.id} href={`/trips/${tripId}/expenses/${e.id}/edit`} className="no-underline block">
                {cardContent}
              </Link>
            );
          }
          return <div key={e.id}>{cardContent}</div>;
        })}

        <Link href={`/trips/${tripId}/expenses/new`} className="block mt-4">
          <Button full size="lg">
            + ثبت هزینه جدید
          </Button>
        </Link>
      </div>
    </div>
  );
}
