import { createClient } from "@/lib/supabase/server";

export async function logAudit(
  tripId: string,
  entityType: string,
  entityId: string,
  action: "create" | "update" | "delete",
  userId: string,
  before?: Record<string, unknown> | null,
  after?: Record<string, unknown> | null
) {
  const supabase = await createClient();
  const { error } = await supabase.from("audit_logs").insert({
    trip_id: tripId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    user_id: userId,
    before: before ?? null,
    after: after ?? null,
  });

  if (error) {
    console.error("[audit] error:", error);
  }
}
