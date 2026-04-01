"use client";

import { useState, useEffect, use, useActionState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { toLatinNumber } from "@/lib/utils";
import { currencySymbol } from "@/lib/constants";
import { createExpense, type ExpenseActionResult } from "../actions";

const SPLIT_MODES = [
  { id: "equal", label: "مساوی" },
  { id: "fixed", label: "مبلغ ثابت" },
  { id: "percentage", label: "درصدی" },
];

const CATEGORIES = [
  { id: "food", label: "غذا", icon: "🍕" },
  { id: "transport", label: "حمل‌ونقل", icon: "⛽" },
  { id: "accommodation", label: "اقامت", icon: "🏨" },
  { id: "entertainment", label: "تفریح", icon: "🎭" },
  { id: "shopping", label: "خرید", icon: "🛍️" },
  { id: "other", label: "سایر", icon: "📦" },
];

type Member = {
  id: string;
  user_id: string;
  display_name: string;
};

export default function NewExpensePage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const today = new Date().toISOString().split("T")[0];
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currency, setCurrency] = useState("");
  const [needsApproval, setNeedsApproval] = useState(false);
  const [splitMode, setSplitMode] = useState("equal");
  const [selectedPayer, setSelectedPayer] = useState<string>("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [category, setCategory] = useState("other");
  const [amount, setAmount] = useState("");
  const [shareValues, setShareValues] = useState<Record<string, string>>({});

  const [state, formAction, pending] = useActionState<ExpenseActionResult, FormData>(
    (_prev, formData) => createExpense(tripId, formData),
    {}
  );

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);

      const { data: tripData } = await supabase
        .from("trips")
        .select("currency, require_approval")
        .eq("id", tripId)
        .single();
      if (tripData) setCurrency(tripData.currency);

      const { data } = await supabase
        .from("trip_members")
        .select("id, user_id, display_name, role")
        .eq("trip_id", tripId);

      if (data) {
        setMembers(data);
        setSelectedParticipants(data.map((m) => m.user_id));
        if (user) {
          setSelectedPayer(user.id);
          // Check if this user's expenses need approval
          const myRole = data.find((m) => m.user_id === user.id)?.role;
          if (tripData?.require_approval && myRole === "member") {
            setNeedsApproval(true);
          }
        }
      }
    }
    load();
  }, [tripId]);

  function toggleParticipant(userId: string) {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  const sharePercent =
    selectedParticipants.length > 0
      ? Math.round(100 / selectedParticipants.length)
      : 0;

  const parsedAmount = parseFloat(toLatinNumber(amount) || "0");

  // Compute share totals for validation
  const shareTotal = selectedParticipants.reduce((sum, uid) => {
    const val = parseFloat(toLatinNumber(shareValues[uid] || "0"));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const hasEnteredShares =
    splitMode !== "equal" &&
    selectedParticipants.some((uid) => shareValues[uid] !== undefined && shareValues[uid] !== "");

  const isShareValid =
    splitMode === "equal" ||
    !hasEnteredShares ||
    (splitMode === "percentage" && Math.abs(shareTotal - 100) < 0.01) ||
    (splitMode === "fixed" && parsedAmount > 0 && Math.abs(shareTotal - parsedAmount) < 0.01);

  return (
    <>
      <PageHeader title="ثبت هزینه" backHref={`/trips/${tripId}`} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <form action={formAction}>
          <InputField label="عنوان" name="title" placeholder="مثلاً: ناهار، بنزین، هتل" icon="✏️" required />

          {/* Amount */}
          <input type="hidden" name="amount" value={toLatinNumber(amount)} />
          <div className="mb-5">
            <label className="block text-xs font-semibold text-text-muted mb-2 text-right">مبلغ</label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="۰"
                required
                className="w-full bg-input-bg border border-border rounded-[18px] py-5 px-4 text-center text-[32px] font-black text-text-primary outline-none placeholder:text-text-muted"
              />
              {currency && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-text-muted/40">{currencySymbol(currency)}</span>
              )}
            </div>
          </div>

          {/* Payer */}
          <input type="hidden" name="payer_id" value={selectedPayer} />
          <div className="mb-4">
            <label className="block text-xs font-semibold text-text-muted mb-2 text-right">پرداخت‌کننده</label>
            <div className="flex gap-2 flex-wrap">
              {members.map((m) => (
                <button
                  key={m.user_id}
                  type="button"
                  onClick={() => setSelectedPayer(m.user_id)}
                  className={`rounded-xl px-3.5 py-2.5 text-[13px] cursor-pointer transition-all ${
                    selectedPayer === m.user_id
                      ? "bg-accent-soft border-[1.5px] border-accent text-accent font-semibold"
                      : "bg-input-bg border border-border text-text-muted"
                  }`}
                >
                  {m.user_id === currentUserId ? "🙋 خودم" : m.display_name}
                </button>
              ))}
            </div>
          </div>

          {/* Split Mode */}
          <input type="hidden" name="split_mode" value={splitMode} />
          <div className="mb-4">
            <label className="block text-xs font-semibold text-text-muted mb-2 text-right">نحوه تقسیم</label>
            <div className="flex gap-1.5 bg-input-bg rounded-xl p-1">
              {SPLIT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
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
            <label className="block text-xs font-semibold text-text-muted mb-2 text-right">افراد شریک</label>
            {members.map((m, i) => {
              const isSelected = selectedParticipants.includes(m.user_id);
              return (
                <div
                  key={m.user_id}
                  onClick={() => toggleParticipant(m.user_id)}
                  className={`flex items-center justify-between py-2.5 cursor-pointer transition-opacity ${
                    i < members.length - 1 ? "border-b border-border" : ""
                  } ${!isSelected ? "opacity-40" : ""}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name={m.display_name} size={30} />
                    <span className={`text-sm ${isSelected ? "text-text-primary" : "text-text-muted line-through"}`}>
                      {m.display_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {splitMode === "equal" && isSelected && (
                      <span className="text-[13px] text-text-muted">{sharePercent}٪</span>
                    )}
                    {splitMode === "percentage" && isSelected && (
                      <input
                        type="text"
                        inputMode="decimal"
                        name={`share_${m.user_id}`}
                        placeholder="٪"
                        value={shareValues[m.user_id] ?? ""}
                        onChange={(e) => setShareValues((prev) => ({ ...prev, [m.user_id]: e.target.value }))}
                        className="w-16 bg-input-bg border border-border rounded-lg px-2 py-1 text-center text-sm text-text-primary outline-none"
                      />
                    )}
                    {splitMode === "fixed" && isSelected && (
                      <input
                        type="text"
                        inputMode="decimal"
                        name={`share_${m.user_id}`}
                        placeholder="مبلغ"
                        value={shareValues[m.user_id] ?? ""}
                        onChange={(e) => setShareValues((prev) => ({ ...prev, [m.user_id]: e.target.value }))}
                        className="w-20 bg-input-bg border border-border rounded-lg px-2 py-1 text-center text-sm text-text-primary outline-none"
                      />
                    )}
                    {isSelected && (
                      <input type="hidden" name="participants" value={m.user_id} />
                    )}
                    <div
                      onClick={(e) => { e.stopPropagation(); toggleParticipant(m.user_id); }}
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                        isSelected
                          ? "bg-accent text-bg"
                          : "bg-input-bg border-[1.5px] border-border text-text-muted"
                      }`}
                    >
                      {isSelected ? "✓" : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Share validation summary */}
          {hasEnteredShares && splitMode === "percentage" && (
            <div className={`text-xs text-center mb-3 font-semibold ${isShareValid ? "text-accent" : "text-danger"}`}>
              مجموع: {Math.round(shareTotal * 100) / 100}٪ از ۱۰۰٪
            </div>
          )}
          {hasEnteredShares && splitMode === "fixed" && (
            <div className={`text-xs text-center mb-3 font-semibold ${isShareValid ? "text-accent" : "text-danger"}`}>
              مجموع: {Math.round(shareTotal).toLocaleString("fa-IR")} از {Math.round(parsedAmount).toLocaleString("fa-IR")}
            </div>
          )}

          {/* Category */}
          <input type="hidden" name="category" value={category} />
          <div className="mb-4">
            <label className="block text-xs font-semibold text-text-muted mb-2 text-right">دسته‌بندی</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`rounded-xl px-3 py-2 text-[12px] cursor-pointer transition-all ${
                    category === cat.id
                      ? "bg-accent-soft border-[1.5px] border-accent text-accent font-semibold"
                      : "bg-input-bg border border-border text-text-muted"
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <input type="hidden" name="date" value={today} />
          <InputField label="توضیحات (اختیاری)" name="description" placeholder="مثلاً: شام در بازار بزرگ" icon="📝" />

          {needsApproval && (
            <div className="bg-input-bg border border-border rounded-xl px-4 py-3 mb-4 flex items-start gap-2.5">
              <span className="text-lg leading-none mt-0.5">ℹ️</span>
              <p className="text-xs text-text-muted m-0">
                هزینه‌های شما پس از تایید ادمین سفر در محاسبات لحاظ می‌شود.
              </p>
            </div>
          )}

          {state.error && (
            <p className="text-danger text-sm mb-3">{state.error}</p>
          )}

          {selectedParticipants.length === 0 && (
            <p className="text-xs text-center mb-3" style={{ color: "var(--color-warning)" }}>حداقل یک نفر باید شریک هزینه باشد</p>
          )}

          <Button full size="lg" disabled={pending || selectedParticipants.length === 0 || !isShareValid}>
            {pending ? "..." : "ثبت هزینه ✓"}
          </Button>
        </form>
      </div>
    </>
  );
}
