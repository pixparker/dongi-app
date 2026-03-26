import type {
  SplitMode,
  MemberRole,
  ExpenseStatus,
  ExpenseCategory,
} from "@/lib/constants";

export type User = {
  id: string;
  username: string;
};

export type Trip = {
  id: string;
  name: string;
  currency: string;
  start_date: string;
  image_url?: string;
  require_approval: boolean;
  created_by: string;
  created_at: string;
};

export type TripMember = {
  id: string;
  trip_id: string;
  user_id: string;
  display_name: string;
  role: MemberRole;
  joined_at: string;
};

export type Expense = {
  id: string;
  trip_id: string;
  title: string;
  amount: number;
  payer_id: string;
  category: ExpenseCategory;
  date: string;
  description?: string;
  split_mode: SplitMode;
  status: ExpenseStatus;
  created_by: string;
  created_at: string;
  is_deleted: boolean;
};

export type ExpenseShare = {
  id: string;
  expense_id: string;
  user_id: string;
  share: number;
};

export type Payment = {
  id: string;
  trip_id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  date: string;
  created_at: string;
  is_deleted: boolean;
};

export type AuditLog = {
  id: string;
  trip_id: string;
  entity_type: string;
  entity_id: string;
  action: "create" | "update" | "delete";
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  user_id: string;
  created_at: string;
};
