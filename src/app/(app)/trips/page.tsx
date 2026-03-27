import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { currencySymbol } from "@/lib/constants";
import { JoinTripButton } from "./join-modal";

const TRIP_EMOJIS = ["🏖️", "🕌", "⛺", "🏔️", "✈️", "🚗", "🎿", "🌴"];
const TRIP_COLORS = ["#00D68F", "#6B8AFF", "#FFB547", "#FF6B6B", "#A78BFA", "#F472B6"];

export default async function TripsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch trips where user is a member, with member count
  const { data: memberships } = await supabase
    .from("trip_members")
    .select("trip_id")
    .eq("user_id", user.id);

  const tripIds = memberships?.map((m) => m.trip_id) ?? [];

  let trips: {
    id: string;
    name: string;
    currency: string;
    created_at: string;
    memberCount: number;
    totalExpense: number;
  }[] = [];

  if (tripIds.length > 0) {
    const { data: tripsData } = await supabase
      .from("trips")
      .select("id, name, currency, created_at")
      .in("id", tripIds)
      .order("created_at", { ascending: false });

    if (tripsData) {
      // Get member counts
      const { data: allMembers } = await supabase
        .from("trip_members")
        .select("trip_id")
        .in("trip_id", tripIds);

      const countMap: Record<string, number> = {};
      allMembers?.forEach((m) => {
        countMap[m.trip_id] = (countMap[m.trip_id] || 0) + 1;
      });

      // Get expense totals (approved only)
      const { data: allExpenses } = await supabase
        .from("expenses")
        .select("trip_id, amount")
        .in("trip_id", tripIds)
        .eq("is_deleted", false)
        .eq("status", "approved");

      const totalMap: Record<string, number> = {};
      allExpenses?.forEach((e) => {
        totalMap[e.trip_id] = (totalMap[e.trip_id] || 0) + Number(e.amount);
      });

      trips = tripsData.map((t) => ({
        ...t,
        memberCount: countMap[t.id] || 0,
        totalExpense: totalMap[t.id] || 0,
      }));
    }
  }

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="سفرهای من" rightAction={
        <Link href="/settings" className="text-text-muted text-lg no-underline">⚙️</Link>
      } />

      <div className="px-5 pb-6">
        {trips.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[48px] mb-3">🎒</div>
            <p className="text-text-muted text-sm">هنوز سفری ندارید</p>
            <p className="text-text-muted text-xs">اولین سفر خود را بسازید!</p>
          </div>
        )}

        {trips.map((trip, i) => (
          <Link key={trip.id} href={`/trips/${trip.id}`} className="no-underline">
            <Card className="mb-3">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center text-[26px] shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${TRIP_COLORS[i % TRIP_COLORS.length]}22, ${TRIP_COLORS[i % TRIP_COLORS.length]}11)`,
                    border: `1px solid ${TRIP_COLORS[i % TRIP_COLORS.length]}33`,
                  }}
                >
                  {TRIP_EMOJIS[i % TRIP_EMOJIS.length]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-text-primary m-0">
                    {trip.name}
                  </h3>
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-xs text-text-muted">
                      👥 {trip.memberCount} نفر
                    </span>
                    <span className="text-xs text-text-muted">
                      💰 {trip.totalExpense > 0 ? `${trip.totalExpense.toLocaleString()} ${currencySymbol(trip.currency)}` : currencySymbol(trip.currency)}
                    </span>
                  </div>
                </div>
                <span className="text-text-muted text-lg">←</span>
              </div>
            </Card>
          </Link>
        ))}

        <div className="mt-5">
          <Link href="/trips/new">
            <Button full size="lg">
              + سفر جدید
            </Button>
          </Link>
        </div>

        <JoinTripButton />
      </div>
    </div>
  );
}
