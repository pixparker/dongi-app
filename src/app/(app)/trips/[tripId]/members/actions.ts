"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export type MemberActionResult = {
  error?: string;
};

export async function promoteMember(
  tripId: string,
  memberId: string
): Promise<MemberActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ابتدا وارد شوید" };

  const { data: member } = await supabase
    .from("trip_members")
    .select("display_name")
    .eq("id", memberId)
    .single();

  const { error } = await supabase
    .from("trip_members")
    .update({ role: "admin" })
    .eq("id", memberId)
    .eq("trip_id", tripId);

  if (error) {
    console.error("[promoteMember] error:", error);
    return { error: `خطا: ${error.message}` };
  }

  await logAudit(tripId, "trip_member", memberId, "update", user.id,
    { role: "member" },
    { role: "admin", display_name: member?.display_name }
  );

  revalidatePath(`/trips/${tripId}/members`);
  return {};
}

export async function removeMember(
  tripId: string,
  memberId: string
): Promise<MemberActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ابتدا وارد شوید" };

  const { data: member } = await supabase
    .from("trip_members")
    .select("display_name")
    .eq("id", memberId)
    .single();

  const { error } = await supabase
    .from("trip_members")
    .delete()
    .eq("id", memberId)
    .eq("trip_id", tripId);

  if (error) {
    console.error("[removeMember] error:", error);
    return { error: `خطا: ${error.message}` };
  }

  await logAudit(tripId, "trip_member", memberId, "delete", user.id,
    { display_name: member?.display_name },
    null
  );

  revalidatePath(`/trips/${tripId}/members`);
  return {};
}
