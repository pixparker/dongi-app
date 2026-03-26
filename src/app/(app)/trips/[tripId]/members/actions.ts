"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  const { error } = await supabase
    .from("trip_members")
    .update({ role: "admin" })
    .eq("id", memberId)
    .eq("trip_id", tripId);

  if (error) {
    console.error("[promoteMember] error:", error);
    return { error: `خطا: ${error.message}` };
  }

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

  const { error } = await supabase
    .from("trip_members")
    .delete()
    .eq("id", memberId)
    .eq("trip_id", tripId);

  if (error) {
    console.error("[removeMember] error:", error);
    return { error: `خطا: ${error.message}` };
  }

  revalidatePath(`/trips/${tripId}/members`);
  return {};
}
