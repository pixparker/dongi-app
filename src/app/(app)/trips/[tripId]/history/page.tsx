import { PageHeader } from "@/components/ui/page-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { timeAgo } from "@/lib/utils";

const ACTION_ICONS: Record<string, string> = {
  create: "🟢",
  update: "🔵",
  delete: "🔴",
};

const ENTITY_LABELS: Record<string, string> = {
  expense: "هزینه",
  payment: "پرداخت",
  trip_member: "عضو",
  trip: "سفر",
};

function formatLogDetail(log: {
  entity_type: string;
  action: string;
  after: Record<string, unknown> | null;
  before: Record<string, unknown> | null;
}): string {
  const entity = ENTITY_LABELS[log.entity_type] ?? log.entity_type;

  if (log.entity_type === "trip_member" && log.action === "create") {
    const name = (log.after?.display_name as string) ?? "کاربر";
    return `${name} به سفر پیوست`;
  }

  if (log.entity_type === "expense") {
    const title = (log.after?.title as string) ?? (log.before?.title as string) ?? "";
    if (log.action === "create") return `هزینه «${title}» ثبت شد`;
    if (log.action === "update") {
      const status = log.after?.status as string;
      if (status === "approved") return `هزینه «${title}» تایید شد`;
      if (status === "rejected") return `هزینه «${title}» رد شد`;
      return `هزینه «${title}» ویرایش شد`;
    }
    if (log.action === "delete") return `هزینه «${title}» حذف شد`;
  }

  if (log.entity_type === "payment") {
    if (log.action === "create") return `پرداخت جدید ثبت شد`;
    if (log.action === "delete") return `پرداخت حذف شد`;
  }

  const actionLabel = log.action === "create" ? "ایجاد" : log.action === "update" ? "ویرایش" : "حذف";
  return `${actionLabel} ${entity}`;
}

export default async function HistoryPage({
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

  const { data: logs } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: members } = await supabase
    .from("trip_members")
    .select("user_id, display_name")
    .eq("trip_id", tripId);

  const memberMap = Object.fromEntries(
    members?.map((m) => [m.user_id, m.display_name]) ?? []
  );

  return (
    <div className="min-h-screen bg-bg flex flex-col direction-rtl">
      <PageHeader title="تاریخچه تغییرات" backHref={`/trips/${tripId}`} />

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {(!logs || logs.length === 0) && (
          <p className="text-text-muted text-sm text-center py-8">هنوز رویدادی ثبت نشده</p>
        )}

        {logs?.map((log, i) => (
          <div
            key={log.id}
            className={`flex gap-3 py-3.5 ${
              i < (logs?.length ?? 0) - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="text-lg pt-0.5">
              {log.entity_type === "trip_member" ? "👋" : ACTION_ICONS[log.action] ?? "⚪"}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-text-primary m-0">
                {formatLogDetail(log)}
              </p>
              <div className="flex gap-2.5 mt-1">
                <span className="text-[11px] text-text-muted">
                  👤 {memberMap[log.user_id] ?? "سیستم"}
                </span>
                <span className="text-[11px] text-text-muted">
                  ⏰ {timeAgo(log.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav tripId={tripId} />
    </div>
  );
}
