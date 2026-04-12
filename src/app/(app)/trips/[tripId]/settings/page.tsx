"use client";

import { use, useEffect, useState } from "react";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { CurrencySelect } from "@/components/ui/currency-select";
import { createClient } from "@/lib/supabase/client";
import { updateTrip, deleteTrip, type TripActionResult } from "../../actions";

type TripData = {
  name: string;
  currency: string;
  require_approval: boolean;
  start_date: string;
  created_by: string;
};

export default function TripSettingsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const [trip, setTrip] = useState<TripData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currency, setCurrency] = useState("");
  const [hasExpenses, setHasExpenses] = useState(false);
  const [requireApproval, setRequireApproval] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data } = await supabase
        .from("trips")
        .select("name, currency, require_approval, start_date, created_by")
        .eq("id", tripId)
        .single();

      if (data) {
        setTrip(data);
        setCurrency(data.currency);
        setRequireApproval(data.require_approval);
      }

      // Check if trip has any expenses (to lock currency)
      const { count } = await supabase
        .from("expenses")
        .select("*", { count: "exact", head: true })
        .eq("trip_id", tripId)
        .eq("is_deleted", false);
      setHasExpenses((count ?? 0) > 0);

      if (user) {
        const { data: member } = await supabase
          .from("trip_members")
          .select("role")
          .eq("trip_id", tripId)
          .eq("user_id", user.id)
          .single();
        setIsAdmin(member?.role === "creator" || member?.role === "admin");
      }
    }
    load();
  }, [tripId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.target as HTMLFormElement);
    formData.set("currency", currency);
    formData.set("require_approval", requireApproval ? "true" : "false");

    const result: TripActionResult = await updateTrip(tripId, formData);
    if (result?.error) {
      setError(result.error);
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteTrip(tripId);
  }

  if (!trip) {
    return (
      <>
        <PageHeader title="تنظیمات سفر" backHref={`/trips/${tripId}`} />
        <div className="flex-1 overflow-y-auto px-5 py-8 text-center text-text-muted">...</div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="تنظیمات سفر" backHref={`/trips/${tripId}`} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <form onSubmit={handleSubmit}>
          <InputField label="نام سفر" name="name" defaultValue={trip.name} icon="✏️" required />

          <CurrencySelect
            value={currency}
            onChange={setCurrency}
            disabled={hasExpenses}
            disabledReason={hasExpenses ? "پس از ثبت هزینه امکان تغییر واحد پول وجود ندارد" : undefined}
          />

          <InputField label="تاریخ شروع" name="start_date" type="date" defaultValue={trip.start_date} icon="📅" />

          {/* Approval Toggle */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-text-muted mb-2 text-right">
              تایید هزینه توسط ادمین
            </label>
            <p className="text-[11px] text-text-muted mb-2 text-right">
              {requireApproval
                ? "هزینه‌های ثبت‌شده توسط اعضا نیاز به تایید ادمین دارند"
                : "هزینه‌ها بدون نیاز به تایید ثبت می‌شوند"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRequireApproval(true)}
                className={`flex-1 rounded-[10px] py-2.5 px-3.5 text-center text-[13px] font-semibold transition-all cursor-pointer ${
                  requireApproval
                    ? "bg-accent-soft border-[1.5px] border-accent text-accent"
                    : "bg-input-bg border border-border text-text-muted"
                }`}
              >
                ✓ نیاز به تایید
              </button>
              <button
                type="button"
                onClick={() => setRequireApproval(false)}
                className={`flex-1 rounded-[10px] py-2.5 px-3.5 text-center text-[13px] font-semibold transition-all cursor-pointer ${
                  !requireApproval
                    ? "bg-accent-soft border-[1.5px] border-accent text-accent"
                    : "bg-input-bg border border-border text-text-muted"
                }`}
              >
                تایید خودکار
              </button>
            </div>
          </div>

          {error && (
            <p className="text-danger text-sm mb-3">{error}</p>
          )}

          <div className="mt-6 space-y-3">
            <Button full variant="primary" size="md" disabled={saving}>
              {saving ? "..." : "ذخیره تغییرات"}
            </Button>
          </div>
        </form>

        {isAdmin && (
          <div className="mt-8 pt-5 border-t border-border">
            <p className="text-xs text-text-muted mb-3 text-right">منطقه خطرناک</p>

            {!showDeleteConfirm ? (
              <Button full variant="danger" size="md" onClick={() => setShowDeleteConfirm(true)}>
                حذف سفر
              </Button>
            ) : (
              <div className="bg-danger-soft border border-danger/20 rounded-xl p-4">
                <p className="text-sm text-danger font-semibold mb-2 m-0">
                  برای حذف، نام سفر را وارد کنید:
                </p>
                <p className="text-xs text-text-muted mb-3 m-0">
                  تایپ کنید: <span className="text-text-primary font-bold">{trip.name}</span>
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder={trip.name}
                  className="w-full bg-input-bg border border-border rounded-xl px-3.5 py-3 text-sm text-text-primary text-right outline-none placeholder:text-text-muted mb-3"
                />
                <div className="flex gap-2">
                  <Button
                    full
                    variant="danger"
                    size="md"
                    disabled={deleteConfirmText !== trip.name || deleting}
                    onClick={handleDelete}
                  >
                    {deleting ? "..." : "تایید و حذف"}
                  </Button>
                  <Button
                    full
                    variant="secondary"
                    size="md"
                    onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                  >
                    انصراف
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
