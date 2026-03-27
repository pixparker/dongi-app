import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { JoinButton } from "./join-button";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  // Fetch trip by invite code with creator info
  const { data: trip } = await supabase
    .from("trips")
    .select("id, name, currency, created_by")
    .eq("invite_code", code)
    .single();

  if (!trip) notFound();

  // Get creator's display name from trip_members
  const { data: creator } = await supabase
    .from("trip_members")
    .select("display_name")
    .eq("trip_id", trip.id)
    .eq("role", "creator")
    .single();

  // Get member count (may return 0 for non-members due to RLS)
  const { data: members } = await supabase
    .from("trip_members")
    .select("id")
    .eq("trip_id", trip.id);

  const memberCount = members?.length ?? 0;

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const creatorName = creator?.display_name ?? "دوست شما";

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 direction-rtl">
      <div className="w-full max-w-sm text-center">
        <div className="text-[56px] mb-4">🎒</div>
        <h1 className="text-2xl font-extrabold text-text-primary mb-2">
          دعوت به سفر
        </h1>
        <p className="text-text-muted text-sm mb-2">
          شما توسط <span className="text-accent font-bold">{creatorName}</span> به{" "}
          <span className="text-accent font-bold">{trip.name}</span> دعوت شده‌اید
        </p>
        {memberCount > 0 && (
          <p className="text-text-muted text-xs mb-8">
            👥 {memberCount} عضو · 💰 {trip.currency}
          </p>
        )}
        {memberCount === 0 && <div className="mb-8" />}

        {user ? (
          <JoinButton inviteCode={code} />
        ) : (
          <>
            <Link href={`/login?redirect=/invite/${code}`}>
              <Button full size="lg" className="mb-3">
                ورود و پیوستن به سفر
              </Button>
            </Link>
            <Link href={`/register?redirect=/invite/${code}`}>
              <Button full variant="secondary" size="md">
                ساخت حساب و پیوستن
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
