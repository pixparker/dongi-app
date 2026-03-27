"use client";

import { useState } from "react";
import { useActionState } from "react";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { CurrencySelect } from "@/components/ui/currency-select";
import { createTrip, type TripActionResult } from "../actions";

export default function NewTripPage() {
  const today = new Date().toISOString().split("T")[0];
  const [currency, setCurrency] = useState("TRY");
  const [requireApproval, setRequireApproval] = useState(false);
  const [state, formAction, pending] = useActionState<TripActionResult, FormData>(
    (_prev, formData) => createTrip(formData),
    {}
  );

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="سفر جدید" backHref="/trips" />

      <div className="px-5 pb-6">
        <form action={formAction}>
          {/* Image Upload placeholder */}
          <div className="w-full h-[120px] rounded-2xl border-2 border-dashed border-accent/25 bg-accent/5 flex flex-col items-center justify-center gap-2 mb-6 cursor-pointer hover:bg-accent/10 transition-colors">
            <span className="text-[32px]">📷</span>
            <span className="text-xs text-text-muted">تصویر سفر (اختیاری)</span>
          </div>

          <InputField label="نام سفر" name="name" placeholder="مثلاً: سفر شمال ۱۴۰۵" icon="✏️" required />

          <input type="hidden" name="currency" value={currency} />
          <CurrencySelect value={currency} onChange={setCurrency} />

          <InputField label="تاریخ شروع" name="start_date" type="date" defaultValue={today} icon="📅" />

          {/* Approval Toggle */}
          <input type="hidden" name="require_approval" value={requireApproval ? "true" : "false"} />
          <div className="mb-4">
            <label className="block text-xs font-semibold text-text-muted mb-2 text-right">
              تایید هزینه توسط ادمین
            </label>
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
                ✓ فعال
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
                غیرفعال
              </button>
            </div>
          </div>

          {state.error && (
            <p className="text-danger text-sm mb-3">{state.error}</p>
          )}

          <div className="mt-6">
            <Button full size="lg" disabled={pending}>
              {pending ? "..." : "ساخت سفر 🚀"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
