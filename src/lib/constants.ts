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
