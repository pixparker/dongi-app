"use client";

import { useState } from "react";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

export default function NewTripPage() {
  const [requireApproval, setRequireApproval] = useState(true);
  const members = ["علی (من)", "حسین", "مریم"];

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="سفر جدید" backHref="/trips" />

      <div className="px-5 pb-6">
        {/* Image Upload */}
        <div className="w-full h-[120px] rounded-2xl border-2 border-dashed border-accent/25 bg-accent/5 flex flex-col items-center justify-center gap-2 mb-6 cursor-pointer hover:bg-accent/10 transition-colors">
          <span className="text-[32px]">📷</span>
          <span className="text-xs text-text-muted">تصویر سفر (اختیاری)</span>
        </div>

        <InputField label="نام سفر" placeholder="مثلاً: سفر شمال ۱۴۰۵" icon="✏️" />
        <InputField label="واحد پول" placeholder="تومان" icon="💱" />
        <InputField label="تاریخ شروع" placeholder="۱۴۰۵/۰۱/۱۵" icon="📅" />

        {/* Approval Toggle */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-text-muted mb-2 text-right">
            تایید هزینه توسط ادمین
          </label>
          <div className="flex gap-2">
            <button
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

        {/* Members */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-text-muted mb-2 text-right">
            اعضای سفر
          </label>
          <div className="flex gap-2 flex-wrap">
            {members.map((name, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-full px-3.5 py-1.5 text-[13px] text-text-primary flex items-center gap-1.5"
              >
                {name}
                {i > 0 && (
                  <span className="text-danger text-sm cursor-pointer">×</span>
                )}
              </div>
            ))}
            <button className="border-[1.5px] border-dashed border-accent/35 rounded-full px-3.5 py-1.5 text-[13px] text-accent cursor-pointer bg-transparent hover:bg-accent-soft transition-colors">
              + عضو جدید
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Button full size="lg">
            ساخت سفر 🚀
          </Button>
        </div>
      </div>
    </div>
  );
}
