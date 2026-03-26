"use client";

import { useState, use } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { PageHeader } from "@/components/ui/page-header";

const MEMBERS = ["علی", "حسین", "مریم", "سارا"];
const SPLIT_MODES = [
  { id: "equal", label: "مساوی" },
  { id: "percent", label: "درصدی" },
  { id: "fixed", label: "مبلغ ثابت" },
];

export default function NewExpensePage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const [splitMode, setSplitMode] = useState("equal");
  const [selectedPayer, setSelectedPayer] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([0, 1, 2, 3]);

  function toggleMember(idx: number) {
    setSelectedMembers((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  }

  const sharePercent = selectedMembers.length > 0 ? Math.round(100 / selectedMembers.length) : 0;

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="ثبت هزینه" backHref={`/trips/${tripId}`} />

      <div className="px-5 pb-6">
        <InputField label="عنوان" placeholder="مثلاً: ناهار، بنزین، هتل" icon="✏️" />

        {/* Amount */}
        <div className="mb-5 text-center">
          <label className="block text-xs font-semibold text-text-muted mb-2">
            مبلغ
          </label>
          <div className="bg-input-bg rounded-[18px] py-5 px-4 border border-border">
            <span className="text-[40px] font-black text-text-primary tracking-tight">
              ۰
            </span>
            <span className="text-lg text-text-muted mr-2">₺</span>
          </div>
        </div>

        {/* Payer */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-text-muted mb-2 text-right">
            پرداخت‌کننده
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedPayer(0)}
              className={`rounded-xl px-4 py-2.5 text-[13px] font-semibold cursor-pointer transition-all ${
                selectedPayer === 0
                  ? "bg-accent-soft border-[1.5px] border-accent text-accent"
                  : "bg-input-bg border border-border text-text-muted"
              }`}
            >
              🙋 خودم
            </button>
            {MEMBERS.slice(1).map((name, i) => (
              <button
                key={name}
                onClick={() => setSelectedPayer(i + 1)}
                className={`rounded-xl px-3.5 py-2.5 text-[13px] cursor-pointer transition-all ${
                  selectedPayer === i + 1
                    ? "bg-accent-soft border-[1.5px] border-accent text-accent font-semibold"
                    : "bg-input-bg border border-border text-text-muted"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Split Mode */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-text-muted mb-2 text-right">
            نحوه تقسیم
          </label>
          <div className="flex gap-1.5 bg-input-bg rounded-xl p-1">
            {SPLIT_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSplitMode(mode.id)}
                className={`flex-1 py-2.5 rounded-[9px] text-xs font-semibold cursor-pointer transition-all border-none ${
                  splitMode === mode.id
                    ? "bg-accent text-bg"
                    : "bg-transparent text-text-muted"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Participants */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-text-muted mb-2 text-right">
            افراد شریک
          </label>
          {MEMBERS.map((name, i) => (
            <div
              key={name}
              className={`flex items-center justify-between py-2.5 ${
                i < MEMBERS.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={name} size={30} />
                <span className="text-sm text-text-primary">{name}</span>
              </div>
              <div className="flex items-center gap-2">
                {splitMode === "equal" && selectedMembers.includes(i) && (
                  <span className="text-[13px] text-text-muted">{sharePercent}٪</span>
                )}
                <button
                  onClick={() => toggleMember(i)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold cursor-pointer transition-all border-none ${
                    selectedMembers.includes(i)
                      ? "bg-accent text-bg"
                      : "bg-input-bg text-text-muted"
                  }`}
                >
                  {selectedMembers.includes(i) ? "✓" : ""}
                </button>
              </div>
            </div>
          ))}
        </div>

        <InputField label="دسته‌بندی" placeholder="غذا، حمل‌ونقل، اقامت..." icon="🏷️" />
        <InputField label="توضیحات (اختیاری)" placeholder="مثلاً: شام در بازار بزرگ" icon="📝" />

        <Button full size="lg">
          ثبت هزینه ✓
        </Button>
      </div>
    </div>
  );
}
