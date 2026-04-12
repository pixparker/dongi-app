import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "dongi" },
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  );

  const { error } = await supabase.from("profiles").select("id").limit(1);

  return NextResponse.json({
    status: error ? "error" : "ok",
    timestamp: new Date().toISOString(),
  });
}
