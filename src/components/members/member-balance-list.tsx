"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";

type MemberBalance = {
  id: string;
  user_id: string;
  display_name: string;
  role: string;
  paid: number;
  share: number;
  balance: number;
  status: "طلبکار" | "بدهکار";
};

const ROLE_LABELS: Record<string, string> = {
  creator: "ادمین اصلی",
  admin: "ادمین",
  member: "عضو",
};

export function MemberBalanceList({
  members,
  currency,
  currentUserId,
}: {
  members: MemberBalance[];
  currency: string;
  currentUserId: string;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      {members.map((m) => {
        const expanded = expandedId === m.id;
        const isMe = m.user_id === currentUserId;
        return (
          <Card
            key={m.id}
            className="mb-2 !p-3"
            onClick={() => setExpandedId(expanded ? null : m.id)}
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar name={m.display_name} size={38} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-text-primary">
                    {m.display_name}
                    {isMe && <span className="text-xs text-text-muted mr-1">(شما)</span>}
                  </span>
                  <StatusPill
                    label={m.status}
                    color={m.status === "طلبکار" ? "var(--color-accent)" : "var(--color-danger)"}
                    bgColor={m.status === "طلبکار" ? "var(--color-accent-soft)" : "var(--color-danger-soft)"}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[11px] text-text-muted">پرداخت: {m.paid.toLocaleString()} {currency}</span>
                  <span
                    className={`text-[13px] font-bold ${
                      m.status === "طلبکار" ? "text-accent" : "text-danger"
                    }`}
                  >
                    {m.balance >= 0 ? "+" : ""}{m.balance.toLocaleString()} {currency}
                  </span>
                </div>
              </div>
              <span className={`text-text-muted text-xs transition-transform ${expanded ? "rotate-90" : ""}`}>
                ◂
              </span>
            </div>

            {expanded && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">نقش</span>
                  <span className="text-text-primary">{ROLE_LABELS[m.role] ?? m.role}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">کل پرداخت</span>
                  <span className="text-text-primary font-semibold">{m.paid.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">سهم از هزینه‌ها</span>
                  <span className="text-text-primary font-semibold">{m.share.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">تراز نهایی</span>
                  <span className={`font-bold ${m.status === "طلبکار" ? "text-accent" : "text-danger"}`}>
                    {m.balance >= 0 ? "+" : ""}{m.balance.toLocaleString()} {currency}
                  </span>
                </div>
                {m.balance > 0 && (
                  <p className="text-[11px] text-accent m-0 pt-1">
                    این عضو {m.balance.toLocaleString()} {currency} طلبکار است
                  </p>
                )}
                {m.balance < 0 && (
                  <p className="text-[11px] text-danger m-0 pt-1">
                    این عضو {Math.abs(m.balance).toLocaleString()} {currency} بدهکار است
                  </p>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </>
  );
}
