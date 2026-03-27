import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { ShareActions } from "./share-actions";

export default async function SharePage({
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
    .select("name, invite_code")
    .eq("id", tripId)
    .single();

  if (!trip) notFound();

  const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"}/invite/${trip.invite_code}`;

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 direction-rtl">
      <div className="w-full max-w-sm text-center">
        <div className="text-[64px] mb-4">🎉</div>
        <h1 className="text-2xl font-extrabold text-accent mb-2">
          سفر ساخته شد!
        </h1>
        <p className="text-text-primary font-bold text-lg mb-1">{trip.name}</p>
        <p className="text-text-muted text-sm mb-8">
          حالا دوستانت را با لینک زیر به سفر دعوت کن
        </p>

        <Card className="mb-5 !p-5">
          <p className="text-xs text-text-muted mb-3 m-0">🔗 لینک دعوت سفر</p>
          <div
            className="bg-input-bg rounded-xl px-4 py-3 text-sm text-accent mb-4 break-all"
            dir="ltr"
          >
            {inviteUrl}
          </div>
          <ShareActions inviteUrl={inviteUrl} />
        </Card>

        <p className="text-text-muted text-xs mb-6">
          هر کسی با این لینک بتواند وارد شود و به سفر بپیوندد
        </p>

        <Link href={`/trips/${tripId}`}>
          <Button full variant="secondary" size="lg">
            رفتن به داشبورد سفر ←
          </Button>
        </Link>
      </div>
    </div>
  );
}
