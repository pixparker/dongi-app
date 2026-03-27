"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toLatinNumber } from "@/lib/utils";

export type PaymentActionResult = {
  error?: string;
};

export async function createPayment(
  tripId: string,
  formData: FormData
): Promise<PaymentActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ابتدا وارد شوید" };

  const fromUserId = formData.get("from_user_id") as string;
  const toUserId = formData.get("to_user_id") as string;
  const amount = parseFloat(toLatinNumber(formData.get("amount") as string));
  const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0];

  if (!fromUserId || !toUserId) return { error: "پرداخت‌کننده و دریافت‌کننده الزامی است" };
  if (fromUserId === toUserId) return { error: "پرداخت‌کننده و دریافت‌کننده نمی‌توانند یکی باشند" };
  if (!amount || amount <= 0) return { error: "مبلغ باید بزرگتر از صفر باشد" };

  const { error } = await supabase.from("payments").insert({
    trip_id: tripId,
    from_user_id: fromUserId,
    to_user_id: toUserId,
    amount,
    date,
  });

  if (error) {
    console.error("[createPayment] error:", error);
    return { error: `خطا در ثبت پرداخت: ${error.message}` };
  }

  redirect(`/trips/${tripId}`);
}

export async function deletePayment(
  tripId: string,
  paymentId: string
): Promise<PaymentActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ابتدا وارد شوید" };

  const { error } = await supabase
    .from("payments")
    .update({ is_deleted: true })
    .eq("id", paymentId);

  if (error) {
    console.error("[deletePayment] error:", error);
    return { error: `خطا: ${error.message}` };
  }

  redirect(`/trips/${tripId}`);
}
