"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deletePhoto(tripId: string, photoId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ابتدا وارد شوید" };

  // Get the photo to find its storage path
  const { data: photo } = await supabase
    .from("trip_photos")
    .select("storage_path, user_id")
    .eq("id", photoId)
    .single();

  if (!photo) return { error: "عکس یافت نشد" };

  // Delete from storage
  await supabase.storage.from("trip-photos").remove([photo.storage_path]);

  // Delete from database
  const { error } = await supabase
    .from("trip_photos")
    .delete()
    .eq("id", photoId);

  if (error) return { error: `خطا در حذف عکس: ${error.message}` };

  revalidatePath(`/trips/${tripId}`);
  return {};
}
