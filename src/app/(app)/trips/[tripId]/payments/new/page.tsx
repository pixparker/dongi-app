"use client";

import { useState, useEffect, use, useActionState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { toLatinNumber } from "@/lib/utils";
import { createPayment, type PaymentActionResult } from "../actions";

type Member = {
  user_id: string;
  display_name: string;
};

export default function NewPaymentPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  return (
    <Suspense>
      <PaymentForm tripId={tripId} />
    </Suspense>
  );
}

function PaymentForm({ tripId }: { tripId: string }) {
  const searchParams = useSearchParams();
  const today = new Date().toISOString().split("T")[0];
  const [members, setMembers] = useState<Member[]>([]);
  const [currency, setCurrency] = useState("");
  const [fromUserId, setFromUserId] = useState(searchParams.get("from") ?? "");
  const [toUserId, setToUserId] = useState(searchParams.get("to") ?? "");
  const [amount, setAmount] = useState(searchParams.get("amount") ?? "");

  const [state, formAction, pending] = useActionState<PaymentActionResult, FormData>(
    (_prev, formData) => createPayment(tripId, formData),
    {}
  );

  useEffect(() => {
    const supabase = createClient();
    supabase.from("trips").select("currency").eq("id", tripId).single()
      .then(({ data }) => { if (data) setCurrency(data.currency); });
    supabase
      .from("trip_members")
      .select("user_id, display_name")
      .eq("trip_id", tripId)
      .then(({ data }) => {
        if (data) setMembers(data);
      });
  }, [tripId]);

  const fromMember = members.find((m) => m.user_id === fromUserId);
  const toMember = members.find((m) => m.user_id === toUserId);

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="ثبت پرداخت" backHref={`/trips/${tripId}/payments`} />

      <div className="px-5 pb-6">
        <p className="text-[13px] text-text-muted text-center mb-6">
          پرداخت مستقیم بین دو نفر
        </p>

        <form action={formAction}>
          <input type="hidden" name="from_user_id" value={fromUserId} />
          <input type="hidden" name="to_user_id" value={toUserId} />
          <input type="hidden" name="date" value={today} />

          {/* From -> To display */}
          {fromMember && toMember && (
            <div className="flex items-center justify-center gap-4 mb-7">
              <div className="text-center">
                <Avatar name={fromMember.display_name} size={56} />
                <p className="mt-1.5 mb-0 text-[13px] font-semibold text-text-primary">
                  {fromMember.display_name}
                </p>
                <p className="m-0 text-[11px] text-text-muted">پرداخت‌کننده</p>
              </div>
              <div className="text-[28px] text-accent">←</div>
              <div className="text-center">
                <Avatar name={toMember.display_name} size={56} />
                <p className="mt-1.5 mb-0 text-[13px] font-semibold text-text-primary">
                  {toMember.display_name}
                </p>
                <p className="m-0 text-[11px] text-text-muted">دریافت‌کننده</p>
              </div>
            </div>
          )}

          {/* Member selectors (shown when not pre-filled) */}
          {!fromMember && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-text-muted mb-2 text-right">پرداخت‌کننده</label>
              <div className="flex gap-2 flex-wrap">
                {members.map((m) => (
                  <button
                    key={m.user_id}
                    type="button"
                    onClick={() => setFromUserId(m.user_id)}
                    className={`rounded-xl px-3.5 py-2.5 text-[13px] cursor-pointer transition-all ${
                      fromUserId === m.user_id
                        ? "bg-accent-soft border-[1.5px] border-accent text-accent font-semibold"
                        : "bg-input-bg border border-border text-text-muted"
                    }`}
                  >
                    {m.display_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!toMember && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-text-muted mb-2 text-right">دریافت‌کننده</label>
              <div className="flex gap-2 flex-wrap">
                {members
                  .filter((m) => m.user_id !== fromUserId)
                  .map((m) => (
                    <button
                      key={m.user_id}
                      type="button"
                      onClick={() => setToUserId(m.user_id)}
                      className={`rounded-xl px-3.5 py-2.5 text-[13px] cursor-pointer transition-all ${
                        toUserId === m.user_id
                          ? "bg-accent-soft border-[1.5px] border-accent text-accent font-semibold"
                          : "bg-input-bg border border-border text-text-muted"
                      }`}
                    >
                      {m.display_name}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Amount */}
          <input type="hidden" name="amount" value={toLatinNumber(amount)} />
          <div className="text-center mb-7">
            <label className="block text-xs font-semibold text-text-muted mb-2">مبلغ پرداخت</label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="۰"
                required
                className="w-full bg-input-bg border border-border rounded-[18px] py-6 px-4 text-center text-[36px] font-black text-accent outline-none placeholder:text-text-muted"
              />
              {currency && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-text-muted">{currency}</span>
              )}
            </div>
          </div>

          {state.error && (
            <p className="text-danger text-sm mb-3">{state.error}</p>
          )}

          <Button full size="lg" disabled={pending}>
            {pending ? "..." : "ثبت پرداخت ✓"}
          </Button>
        </form>
      </div>
    </div>
  );
}
