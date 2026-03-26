"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type TripActionResult = {
  error?: string;
};

export async function createTrip(formData: FormData): Promise<TripActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ابتدا وارد شوید" };

  const name = (formData.get("name") as string)?.trim();
  const currency = (formData.get("currency") as string)?.trim() || "TRY";
  const startDate = (formData.get("start_date") as string) || new Date().toISOString().split("T")[0];
  const requireApproval = formData.get("require_approval") === "true";

  if (!name) {
    return { error: "نام سفر الزامی است" };
  }

  // Get the user's profile for display_name
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("[createTrip] profile fetch error:", profileError);
  }

  // Create the trip
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .insert({
      name,
      currency,
      start_date: startDate,
      require_approval: requireApproval,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (tripError) {
    console.error("[createTrip] insert error:", tripError);
    return { error: `خطا در ساخت سفر: ${tripError.message}` };
  }

  // Add creator as trip member
  const { error: memberError } = await supabase.from("trip_members").insert({
    trip_id: trip.id,
    user_id: user.id,
    display_name: profile?.username ?? "کاربر",
    role: "creator",
  });

  if (memberError) {
    console.error("[createTrip] member insert error:", memberError);
    return { error: `خطا در افزودن عضو: ${memberError.message}` };
  }

  redirect(`/trips/${trip.id}`);
}

export async function updateTrip(
  tripId: string,
  formData: FormData
): Promise<TripActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ابتدا وارد شوید" };

  const name = (formData.get("name") as string)?.trim();
  const currency = (formData.get("currency") as string)?.trim();

  if (!name) {
    return { error: "نام سفر الزامی است" };
  }

  const { error } = await supabase
    .from("trips")
    .update({ name, currency })
    .eq("id", tripId);

  if (error) {
    console.error("[updateTrip] error:", error);
    return { error: `خطا در بروزرسانی سفر: ${error.message}` };
  }

  revalidatePath(`/trips/${tripId}`);
  redirect(`/trips/${tripId}`);
}

export async function deleteTrip(tripId: string): Promise<TripActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ابتدا وارد شوید" };

  const { error } = await supabase.from("trips").delete().eq("id", tripId);

  if (error) {
    console.error("[deleteTrip] error:", error);
    return { error: `خطا در حذف سفر: ${error.message}` };
  }

  redirect("/trips");
}
