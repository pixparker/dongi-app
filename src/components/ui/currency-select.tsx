"use client";

import { useState } from "react";
import { CURRENCIES, currencySymbol } from "@/lib/constants";

interface CurrencySelectProps {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function CurrencySelect({ value, onChange, disabled, disabledReason }: CurrencySelectProps) {
  const isKnown = CURRENCIES.some((c) => c.code === value);
  const [isOther, setIsOther] = useState(!isKnown && value !== "" && value !== "TRY");
  const [customValue, setCustomValue] = useState(!isKnown ? value : "");

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val === "__other__") {
      setIsOther(true);
      setCustomValue("");
      onChange("");
    } else {
      setIsOther(false);
      setCustomValue("");
      onChange(val);
    }
  }

  function handleCustom(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setCustomValue(val);
    onChange(val);
  }

  if (disabled) {
    const label = currencySymbol(value);
    return (
      <div className="mb-4">
        <label className="block text-xs font-semibold text-text-muted mb-1.5 text-right">واحد پول</label>
        {disabledReason && (
          <p className="text-[11px] text-text-muted mb-1.5 text-right">{disabledReason}</p>
        )}
        <div className="bg-input-bg border border-border rounded-xl px-3.5 py-3 text-sm text-text-muted opacity-60">
          {label} ({value})
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-text-muted mb-1.5 text-right">واحد پول</label>
      <select
        value={isOther ? "__other__" : value}
        onChange={handleSelect}
        className="w-full bg-input-bg border border-border rounded-xl px-3.5 py-3 text-sm text-text-primary outline-none appearance-none cursor-pointer direction-rtl"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.name}
          </option>
        ))}
        <option value="__other__">سایر...</option>
      </select>

      {isOther && (
        <input
          type="text"
          value={customValue}
          onChange={handleCustom}
          placeholder="واحد پول را وارد کنید (مثلاً: دینار)"
          className="w-full bg-input-bg border border-border rounded-xl px-3.5 py-3 text-sm text-text-primary text-right outline-none mt-2 placeholder:text-text-muted"
        />
      )}
    </div>
  );
}
