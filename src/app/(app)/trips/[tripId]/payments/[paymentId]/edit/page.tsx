"use client";

import { useState, useEffect, use, Suspense } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { toLatinNumber } from "@/lib/utils";
import { currencySymbol } from "@/lib/constants";
import { updatePayment, deletePayment, type PaymentActionResult } from "../../actions";

type Member = {
  user_id: string;
  display_name: string;
};

export default function EditPaymentPage({
  params,
}: {
  params: Promise<{ tripId: string; paymentId: string }>;
}) {
  const { tripId, paymentId } = use(params);
  return (
    <Suspense>
      <EditPaymentForm tripId={tripId} paymentId={paymentId} />
    </Suspense>
  );
}

function EditPaymentForm({
  tripId,
  paymentId,
}: {
  tripId: string;
  paymentId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [currency, setCurrency] = useState("");
  const [fromUserId, setFromUserId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: tripData } = await supabase
        .from("trips")
        .select("currency")
        .eq("id", tripId)
        .single();
      if (tripData) setCurrency(tripData.currency);

      const { data: membersData } = await supabase
        .from("trip_members")
        .select("user_id, display_name")
        .eq("trip_id", tripId);
      if (membersData) setMembers(membersData);

      const { data: payment } = await supabase
        .from("payments")
        .select("*")
        .eq("id", paymentId)
        .single();

      if (payment) {
        setFromUserId(payment.from_user_id);
        setToUserId(payment.to_user_id);
        setAmount(String(payment.amount));
        setDate(payment.date);
      }

      setLoading(false);
    }
    load();
  }, [tripId, paymentId]);

  async function handleSubmit() {
    setError(null);
    setSaving(true);

    const formData = new FormData();
    formData.set("from_user_id", fromUserId);
    formData.set("to_user_id", toUserId);
    formData.set("amount", toLatinNumber(amount));
    formData.set("date", date);

    const result: PaymentActionResult = await updatePayment(
      tripId,
      paymentId,
      formData
    );
    if (result?.error) {
      setError(result.error);
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await deletePayment(tripId, paymentId);
    if (result?.error) {
      setError(result.error);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <>
        <PageHeader
          title="ویرایش پرداخت"
          backHref={`/trips/${tripId}/payments`}
        />
        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="ویرایش پرداخت"
        backHref={`/trips/${tripId}/payments`}
      />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <p className="text-[13px] text-text-muted text-center mb-6">
          ویرایش پرداخت مستقیم بین دو نفر
        </p>

        {/* From */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-text-muted mb-2 text-right">
            پرداخت‌کننده
          </label>
          <div className="flex gap-2 flex-wrap">
            {members.map((m) => (
              <button
                key={m.user_id}
                type="button"
                onClick={() => {
                  setFromUserId(m.user_id);
                  if (toUserId === m.user_id) setToUserId("");
                }}
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

        {/* To */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-text-muted mb-2 text-right">
            دریافت‌کننده
          </label>
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

        {/* Avatar display */}
        {fromUserId && toUserId && (
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="text-center">
              <Avatar
                name={
                  members.find((m) => m.user_id === fromUserId)
                    ?.display_name ?? "?"
                }
                size={48}
              />
            </div>
            <div className="text-[24px] text-accent">←</div>
            <div className="text-center">
              <Avatar
                name={
                  members.find((m) => m.user_id === toUserId)?.display_name ??
                  "?"
                }
                size={48}
              />
            </div>
          </div>
        )}

        {/* Amount */}
        <div className="text-center mb-5">
          <label className="block text-xs font-semibold text-text-muted mb-2">
            مبلغ پرداخت
          </label>
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
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-text-muted/40">
                {currencySymbol(currency)}
              </span>
            )}
          </div>
        </div>

        {error && <p className="text-danger text-sm mb-3">{error}</p>}

        <div className="space-y-2.5">
          <Button
            full
            size="lg"
            disabled={saving || !fromUserId || !toUserId}
            onClick={handleSubmit}
          >
            {saving ? "..." : "ذخیره تغییرات"}
          </Button>

          <Button
            full
            variant="danger"
            size="md"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? "..." : "حذف پرداخت"}
          </Button>
        </div>
      </div>
    </>
  );
}
