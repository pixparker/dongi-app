"use client";

import { use } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

const MEMBERS = [
  { name: "علی", role: "ادمین اصلی", badge: "👑" },
  { name: "حسین", role: "ادمین معتمد", badge: "⭐" },
  { name: "مریم", role: "عضو", badge: null },
  { name: "سارا", role: "عضو", badge: null },
];

export default function MembersPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="اعضای سفر" backHref={`/trips/${tripId}`} />

      <div className="px-5 pb-6">
        {MEMBERS.map((m) => (
          <Card key={m.name} className="mb-2 !py-3.5 !px-4">
            <div className="flex items-center gap-3.5">
              <Avatar name={m.name} size={42} />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-semibold text-text-primary">{m.name}</span>
                  {m.badge && <span className="text-sm">{m.badge}</span>}
                </div>
                <span className="text-xs text-text-muted">{m.role}</span>
              </div>
              {m.role === "عضو" && (
                <Button variant="ghost" size="sm">ارتقا به ادمین</Button>
              )}
            </div>
          </Card>
        ))}

        {/* Invite Link */}
        <Card className="mt-5 text-center">
          <p className="text-[13px] text-text-muted m-0 mb-2.5">🔗 لینک دعوت</p>
          <div className="bg-input-bg rounded-[10px] px-3.5 py-2.5 text-xs text-accent mb-2.5 break-all" dir="ltr">
            dongi.app/join/xK9m2pQ
          </div>
          <Button variant="primary" size="sm">کپی لینک</Button>
        </Card>

        <div className="mt-3.5">
          <Button full variant="secondary" size="md">
            + افزودن عضو جدید
          </Button>
        </div>
      </div>
    </div>
  );
}
