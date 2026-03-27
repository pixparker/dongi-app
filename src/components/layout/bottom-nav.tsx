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
    { id: "addExpense", icon: "💸", label: "هزینه", href: `/trips/${tripId}/expenses/new` },
    { id: "settlement", icon: "💰", label: "تسویه", href: `/trips/${tripId}/payments` },
    { id: "history", icon: "📋", label: "تاریخچه", href: `/trips/${tripId}/history` },
  ];

  function isActive(item: NavItem) {
    if (item.id === "dashboard") return pathname === `/trips/${tripId}`;
    return pathname.startsWith(item.href);
  }

  return (
    <nav className="flex justify-around px-3 pt-2 pb-6 bg-card border-t border-border shrink-0">
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
            <span className="text-xl">{item.icon}</span>
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
