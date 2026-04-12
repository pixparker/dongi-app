"use client";

import { useState, useEffect, use } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { toLatinNumber } from "@/lib/utils";
import { currencySymbol } from "@/lib/constants";
import { updateExpense, type ExpenseActionResult } from "../../actions";

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

type Member = { user_id: string; display_name: string };

export default function EditExpensePage({
  params,
}: {
  params: Promise<{ tripId: string; expenseId: string }>;
}) {
  const { tripId, expenseId } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [currency, setCurrency] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedPayer, setSelectedPayer] = useState("");
  const [splitMode, setSplitMode] = useState("equal");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [category, setCategory] = useState("other");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

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

      const { data: expense } = await supabase
        .from("expenses")
        .select("*")
        .eq("id", expenseId)
        .single();

      if (expense) {
        setTitle(expense.title);
        setAmount(String(expense.amount));
        setSelectedPayer(expense.payer_id);
        setSplitMode(expense.split_mode);
        setCategory(expense.category);
        setDescription(expense.description ?? "");
        setStatus(expense.status);
      }

      const { data: shares } = await supabase
        .from("expense_shares")
        .select("user_id")
        .eq("expense_id", expenseId);
      if (shares) {
        setSelectedParticipants(shares.map((s) => s.user_id));
      }

      setLoading(false);
    }
    load();
  }, [tripId, expenseId]);

  function toggleParticipant(userId: string) {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  async function handleSubmit(newStatus: string) {
    setError(null);
    setSaving(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("amount", toLatinNumber(amount));
    formData.set("payer_id", selectedPayer);
    formData.set("category", category);
    formData.set("split_mode", splitMode);
    formData.set("description", description);
    formData.set("status", newStatus);
    selectedParticipants.forEach((uid) => formData.append("participants", uid));

    const result: ExpenseActionResult = await updateExpense(tripId, expenseId, formData);
    if (result?.error) {
      setError(result.error);
      setSaving(false);
    }
  }

  const sharePercent =
    selectedParticipants.length > 0 ? Math.round(100 / selectedParticipants.length) : 0;

  if (loading) {
    return (
      <>
        <PageHeader title="ویرایش هزینه" backHref={`/trips/${tripId}/expenses`} />
        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="ویرایش هزینه" backHref={`/trips/${tripId}/expenses`} />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <InputField label="عنوان" icon="✏️" value={title} onChange={(e) => setTitle(e.target.value)} required />

        {/* Amount */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-text-muted mb-2 text-right">مبلغ</label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-input-bg border border-border rounded-[18px] py-5 px-4 text-center text-[32px] font-black text-text-primary outline-none"
            />
            {currency && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-text-muted/40">
                {currencySymbol(currency)}
              </span>
            )}
          </div>
        </div>

        {/* Payer */}
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
                {m.display_name}
              </button>
            ))}
          </div>
        </div>

        {/* Split Mode */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-text-muted mb-2 text-right">نحوه تقسیم</label>
          <div className="flex gap-1.5 bg-input-bg rounded-xl p-1">
            {SPLIT_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSplitMode(mode.id)}
                className={`flex-1 py-2.5 rounded-[9px] text-xs font-semibold cursor-pointer transition-all border-none ${
                  splitMode === mode.id ? "bg-accent text-bg" : "bg-transparent text-text-muted"
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
                <div className="flex items-center gap-2">
                  {splitMode === "equal" && isSelected && (
                    <span className="text-[13px] text-text-muted">{sharePercent}٪</span>
                  )}
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
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

        {/* Category */}
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

        <InputField label="توضیحات (اختیاری)" icon="📝" value={description} onChange={(e) => setDescription(e.target.value)} />

        {error && <p className="text-danger text-sm mb-3">{error}</p>}

        {selectedParticipants.length === 0 && (
          <p className="text-xs text-center mb-3" style={{ color: "var(--color-warning)" }}>
            حداقل یک نفر باید شریک هزینه باشد
          </p>
        )}

        <div className="space-y-2.5">
          <Button
            full
            size="lg"
            disabled={saving || selectedParticipants.length === 0}
            onClick={() => handleSubmit("approved")}
          >
            {saving ? "..." : "ذخیره و تایید ✓"}
          </Button>

          {status === "pending" && (
            <Button
              full
              variant="danger"
              size="md"
              disabled={saving}
              onClick={() => handleSubmit("rejected")}
            >
              رد هزینه ✗
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
