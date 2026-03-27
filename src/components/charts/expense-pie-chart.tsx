"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { currencySymbol } from "@/lib/constants";

const CATEGORY_COLORS: Record<string, string> = {
  food: "#00D68F",
  transport: "#6B8AFF",
  accommodation: "#FFB547",
  entertainment: "#A78BFA",
  shopping: "#F472B6",
  other: "#64748B",
};

const CATEGORY_NAMES: Record<string, string> = {
  food: "غذا",
  transport: "حمل‌ونقل",
  accommodation: "اقامت",
  entertainment: "تفریح",
  shopping: "خرید",
  other: "سایر",
};

type Expense = {
  category: string;
  amount: number;
};

export function ExpensePieChart({
  expenses,
  currency,
}: {
  expenses: Expense[];
  currency: string;
}) {
  // Group by category
  const catTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount);
  });

  const total = Object.values(catTotals).reduce((sum, v) => sum + v, 0);
  if (total === 0) return null;

  const data = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, value]) => ({
      name: CATEGORY_NAMES[cat] ?? cat,
      value,
      color: CATEGORY_COLORS[cat] ?? "#64748B",
      pct: Math.round((value / total) * 100),
    }));

  const symbol = currencySymbol(currency);

  return (
    <div>
      <h3 className="text-sm font-bold text-text-primary mt-4 mb-3">ترکیب هزینه‌ها</h3>
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={52}
                dataKey="value"
                strokeWidth={2}
                stroke="var(--color-bg)"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: d.color }}
                />
                <span className="text-text-muted">{d.name}</span>
              </div>
              <span className="text-text-primary font-semibold">
                {d.value.toLocaleString()} {symbol} ({d.pct}٪)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
