import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { MemberActions } from "./member-actions";

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
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="اعضای سفر" backHref={`/trips/${tripId}`} />

      <div className="px-5 pb-6">
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
        <Card className="mt-5 text-center">
          <p className="text-[13px] text-text-muted m-0 mb-2.5">🔗 لینک دعوت</p>
          <div
            className="bg-input-bg rounded-[10px] px-3.5 py-2.5 text-xs text-accent mb-2.5 break-all cursor-pointer"
            dir="ltr"
            onClick={undefined}
          >
            {inviteUrl}
          </div>
          <CopyButton text={inviteUrl} />
        </Card>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  return (
    <form
      action={async () => {
        "use server";
        // Copy happens client-side, this is just a placeholder
      }}
    >
      <button
        type="button"
        className="bg-accent text-bg px-3.5 py-2 text-xs rounded-[10px] font-bold cursor-pointer border-none"
        data-copy={text}
      >
        کپی لینک
      </button>
    </form>
  );
}
