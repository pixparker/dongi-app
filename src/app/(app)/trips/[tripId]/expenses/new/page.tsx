"use client";

import { useState, useEffect, use, useActionState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { toLatinNumber } from "@/lib/utils";
import { createExpense, type ExpenseActionResult } from "../actions";

const SPLIT_MODES = [
  { id: "equal", label: "مساوی" },
  { id: "percentage", label: "درصدی" },
  { id: "fixed", label: "مبلغ ثابت" },
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
  const [splitMode, setSplitMode] = useState("equal");
  const [selectedPayer, setSelectedPayer] = useState<string>("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [category, setCategory] = useState("other");
  const [amount, setAmount] = useState("");

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
        .select("currency")
        .eq("id", tripId)
        .single();
      if (tripData) setCurrency(tripData.currency);

      const { data } = await supabase
        .from("trip_members")
        .select("id, user_id, display_name")
        .eq("trip_id", tripId);

      if (data) {
        setMembers(data);
        setSelectedParticipants(data.map((m) => m.user_id));
        // Default payer to current user
        if (user) {
          setSelectedPayer(user.id);
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

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="ثبت هزینه" backHref={`/trips/${tripId}`} />

      <div className="px-5 pb-6">
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
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-text-muted">{currency}</span>
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
            {members.map((m, i) => (
              <div
                key={m.user_id}
                className={`flex items-center justify-between py-2.5 ${
                  i < members.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Avatar name={m.display_name} size={30} />
                  <span className="text-sm text-text-primary">{m.display_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {splitMode === "equal" && selectedParticipants.includes(m.user_id) && (
                    <span className="text-[13px] text-text-muted">{sharePercent}٪</span>
                  )}
                  {splitMode === "percentage" && selectedParticipants.includes(m.user_id) && (
                    <input
                      type="number"
                      name={`share_${m.user_id}`}
                      placeholder="٪"
                      min="0"
                      max="100"
                      className="w-16 bg-input-bg border border-border rounded-lg px-2 py-1 text-center text-sm text-text-primary outline-none"
                    />
                  )}
                  {splitMode === "fixed" && selectedParticipants.includes(m.user_id) && (
                    <input
                      type="number"
                      name={`share_${m.user_id}`}
                      placeholder="مبلغ"
                      min="0"
                      step="0.01"
                      className="w-20 bg-input-bg border border-border rounded-lg px-2 py-1 text-center text-sm text-text-primary outline-none"
                    />
                  )}
                  {selectedParticipants.includes(m.user_id) && (
                    <input type="hidden" name="participants" value={m.user_id} />
                  )}
                  <button
                    type="button"
                    onClick={() => toggleParticipant(m.user_id)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold cursor-pointer transition-all border-none ${
                      selectedParticipants.includes(m.user_id)
                        ? "bg-accent text-bg"
                        : "bg-input-bg text-text-muted"
                    }`}
                  >
                    {selectedParticipants.includes(m.user_id) ? "✓" : ""}
                  </button>
                </div>
              </div>
            ))}
          </div>

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

          {state.error && (
            <p className="text-danger text-sm mb-3">{state.error}</p>
          )}

          <Button full size="lg" disabled={pending}>
            {pending ? "..." : "ثبت هزینه ✓"}
          </Button>
        </form>
      </div>
    </div>
  );
}
