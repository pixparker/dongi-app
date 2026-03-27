export const SPLIT_MODES = ["equal", "percentage", "fixed"] as const;
export type SplitMode = (typeof SPLIT_MODES)[number];

export const MEMBER_ROLES = ["creator", "admin", "member"] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const EXPENSE_STATUSES = ["pending", "approved", "rejected"] as const;
export type ExpenseStatus = (typeof EXPENSE_STATUSES)[number];

export const EXPENSE_CATEGORIES = [
  "food",
  "transport",
  "accommodation",
  "entertainment",
  "shopping",
  "other",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const CURRENCIES = [
  { code: "TRY", symbol: "₺", name: "لیر ترکیه" },
  { code: "IRT", symbol: "تومان", name: "تومان ایران" },
  { code: "USD", symbol: "$", name: "دلار آمریکا" },
  { code: "EUR", symbol: "€", name: "یورو" },
  { code: "GBP", symbol: "£", name: "پوند انگلیس" },
  { code: "AED", symbol: "د.إ", name: "درهم امارات" },
] as const;

export function currencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code.toUpperCase())?.symbol ?? code;
}

export function currencyLabel(code: string): string {
  const c = CURRENCIES.find((c) => c.code === code.toUpperCase());
  return c ? `${c.symbol} ${c.name}` : code;
}
