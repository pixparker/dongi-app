"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function joinTrip(inviteCode: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/invite/${inviteCode}`);
  }

  // Find trip by invite code
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id")
    .eq("invite_code", inviteCode)
    .single();

  if (tripError || !trip) {
    return { error: "لینک دعوت نامعتبر است" };
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from("trip_members")
    .select("id")
    .eq("trip_id", trip.id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    redirect(`/trips/${trip.id}`);
  }

  // Get profile for display_name
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", user.id)
    .single();

  // Join as member
  const { error } = await supabase.from("trip_members").insert({
    trip_id: trip.id,
    user_id: user.id,
    display_name: profile?.display_name ?? profile?.username ?? "کاربر",
    role: "member",
  });

  if (error) {
    console.error("[joinTrip] error:", error);
    return { error: `خطا در پیوستن: ${error.message}` };
  }

  redirect(`/trips/${trip.id}`);
}
