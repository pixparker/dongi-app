import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { MemberActions } from "./member-actions";
import { CopyInviteCard } from "./copy-invite-card";

const ROLE_LABELS: Record<string, string> = {
  creator: "ادمین اصلی",
  admin: "ادمین معتمد",
  member: "عضو",
};

const ROLE_BADGES: Record<string, string | null> = {
  creator: "👑",
  admin: "⭐",
  member: null,
};

export default async function MembersPage({
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
    .select("invite_code")
    .eq("id", tripId)
    .single();

  if (!trip) notFound();

  const { data: members } = await supabase
    .from("trip_members")
    .select("*")
    .eq("trip_id", tripId)
    .order("joined_at", { ascending: true });

  // Check if current user is admin
  const currentMember = members?.find((m) => m.user_id === user.id);
  const isAdmin = currentMember?.role === "creator" || currentMember?.role === "admin";

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"}/invite/${trip.invite_code}`;

  return (
    <>
      <PageHeader title="اعضای سفر" backHref={`/trips/${tripId}`} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {members?.map((m) => (
          <Card key={m.id} className="mb-2 !py-3.5 !px-4">
            <div className="flex items-center gap-3.5">
              <Avatar name={m.display_name} size={42} />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-semibold text-text-primary">
                    {m.display_name}
                  </span>
                  {ROLE_BADGES[m.role] && (
                    <span className="text-sm">{ROLE_BADGES[m.role]}</span>
                  )}
                </div>
                <span className="text-xs text-text-muted">
                  {ROLE_LABELS[m.role] ?? m.role}
                </span>
              </div>
              {isAdmin && m.role === "member" && (
                <MemberActions tripId={tripId} memberId={m.id} />
              )}
            </div>
          </Card>
        ))}

        {/* Invite Link */}
        <CopyInviteCard inviteUrl={inviteUrl} />
      </div>
    </>
  );
}

