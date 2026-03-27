"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toLatinNumber } from "@/lib/utils";

export type ExpenseActionResult = {
  error?: string;
};

export async function createExpense(
  tripId: string,
  formData: FormData
): Promise<ExpenseActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ابتدا وارد شوید" };

  const title = (formData.get("title") as string)?.trim();
  const amount = parseFloat(toLatinNumber(formData.get("amount") as string));
  const payerId = formData.get("payer_id") as string;
  const category = (formData.get("category") as string) || "other";
  const splitMode = (formData.get("split_mode") as string) || "equal";
  const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0];
  const description = (formData.get("description") as string)?.trim() || null;
  const participantIds = formData.getAll("participants") as string[];

  if (!title) return { error: "عنوان هزینه الزامی است" };
  if (!amount || amount <= 0) return { error: "مبلغ باید بزرگتر از صفر باشد" };
  if (!payerId) return { error: "پرداخت‌کننده را انتخاب کنید" };
  if (participantIds.length === 0) return { error: "حداقل یک نفر باید شریک باشد" };

  // Check if trip requires approval and user is not admin
  const { data: trip } = await supabase
    .from("trips")
    .select("require_approval")
    .eq("id", tripId)
    .single();

  const { data: membership } = await supabase
    .from("trip_members")
    .select("role")
    .eq("trip_id", tripId)
    .eq("user_id", user.id)
    .single();

  const needsApproval =
    trip?.require_approval &&
    membership?.role === "member";

  const status = needsApproval ? "pending" : "approved";

  // Insert expense
  const { data: expense, error: expenseError } = await supabase
    .from("expenses")
    .insert({
      trip_id: tripId,
      title,
      amount,
      payer_id: payerId,
      category,
      date,
      description,
      split_mode: splitMode,
      status,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (expenseError) {
    console.error("[createExpense] error:", expenseError);
    return { error: `خطا در ثبت هزینه: ${expenseError.message}` };
  }

  // Calculate and insert shares
  let shares: { expense_id: string; user_id: string; share: number }[] = [];

  if (splitMode === "equal") {
    const perPerson = Math.round((amount / participantIds.length) * 100) / 100;
    shares = participantIds.map((uid) => ({
      expense_id: expense.id,
      user_id: uid,
      share: perPerson,
    }));
  } else if (splitMode === "percentage") {
    shares = participantIds.map((uid) => {
      const pct = parseFloat(toLatinNumber((formData.get(`share_${uid}`) as string) || "0"));
      return {
        expense_id: expense.id,
        user_id: uid,
        share: Math.round((amount * pct) / 100 * 100) / 100,
      };
    });
  } else if (splitMode === "fixed") {
    shares = participantIds.map((uid) => ({
      expense_id: expense.id,
      user_id: uid,
      share: parseFloat(toLatinNumber((formData.get(`share_${uid}`) as string) || "0")),
    }));
  }

  const { error: sharesError } = await supabase
    .from("expense_shares")
    .insert(shares);

  if (sharesError) {
    console.error("[createExpense] shares error:", sharesError);
    return { error: `خطا در ثبت سهم‌ها: ${sharesError.message}` };
  }

  redirect(`/trips/${tripId}`);
}

export async function deleteExpense(
  tripId: string,
  expenseId: string
): Promise<ExpenseActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "ابتدا وارد شوید" };

  const { error } = await supabase
    .from("expenses")
    .update({ is_deleted: true })
    .eq("id", expenseId);

  if (error) {
    console.error("[deleteExpense] error:", error);
    return { error: `خطا: ${error.message}` };
  }

  redirect(`/trips/${tripId}`);
}
