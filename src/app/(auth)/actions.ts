"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = {
  error?: string;
};

export async function login(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "نام کاربری و رمز عبور الزامی است" };
  }

  const email = `${username.toLowerCase()}@gmail.com`;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "نام کاربری یا رمز عبور اشتباه است" };
  }

  const redirectTo = formData.get("redirect") as string;
  redirect(redirectTo || "/trips");
}

export async function register(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient();

  const displayName = (formData.get("display_name") as string)?.trim();
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!displayName || !username || !password) {
    return { error: "نام نمایشی، نام کاربری و رمز عبور الزامی است" };
  }

  if (username.length < 3) {
    return { error: "نام کاربری باید حداقل ۳ کاراکتر باشد" };
  }

  if (password.length < 6) {
    return { error: "رمز عبور باید حداقل ۶ کاراکتر باشد" };
  }

  if (password !== confirmPassword) {
    return { error: "رمز عبور و تکرار آن یکسان نیستند" };
  }

  const email = `${username.toLowerCase()}@gmail.com`;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: displayName },
    },
  });

  if (error) {
    console.error("[register] error:", error);
    if (error.message.includes("already registered")) {
      return { error: "این نام کاربری قبلاً ثبت شده است" };
    }
    return { error: `خطا در ثبت‌نام: ${error.message}` };
  }

  const redirectTo = formData.get("redirect") as string;
  redirect(redirectTo || "/trips");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
