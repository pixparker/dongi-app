"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  id: string;
  icon: string;
  label: string;
  href: string;
}

export function BottomNav({ tripId }: { tripId: string }) {
  const pathname = usePathname();

  const items: NavItem[] = [
    { id: "dashboard", icon: "📊", label: "داشبورد", href: `/trips/${tripId}` },
    { id: "expenses", icon: "🧾", label: "هزینه‌ها", href: `/trips/${tripId}/expenses` },
    { id: "addExpense", icon: "+", label: "هزینه", href: `/trips/${tripId}/expenses/new` },
    { id: "settlement", icon: "💰", label: "تسویه", href: `/trips/${tripId}/payments` },
    { id: "history", icon: "📋", label: "تاریخچه", href: `/trips/${tripId}/history` },
  ];

  function isActive(item: NavItem) {
    if (item.id === "dashboard") return pathname === `/trips/${tripId}`;
    if (item.id === "addExpense") return pathname === `/trips/${tripId}/expenses/new`;
    if (item.id === "expenses") return pathname.startsWith(`/trips/${tripId}/expenses`) && pathname !== `/trips/${tripId}/expenses/new`;
    return pathname.startsWith(item.href);
  }

  return (
    <nav className="flex justify-around px-3 pt-1.5 pb-2 bg-card border-t border-border shrink-0">
      {items.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all no-underline ${
              active ? "bg-accent-soft" : ""
            }`}
          >
            {item.id === "addExpense" ? (
              <span className="w-8 h-8 rounded-full bg-accent text-bg flex items-center justify-center text-xl font-bold leading-none">+</span>
            ) : (
              <span className="text-xl">{item.icon}</span>
            )}
            <span
              className={`text-[10px] ${
                active ? "font-bold text-accent" : "font-medium text-text-muted"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
