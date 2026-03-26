"use client";

import { Button } from "@/components/ui/button";
import { promoteMember, removeMember } from "./actions";

export function MemberActions({
  tripId,
  memberId,
}: {
  tripId: string;
  memberId: string;
}) {
  return (
    <div className="flex gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          const result = await promoteMember(tripId, memberId);
          if (result.error) alert(result.error);
        }}
      >
        ارتقا
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={async () => {
          if (!confirm("حذف این عضو؟")) return;
          const result = await removeMember(tripId, memberId);
          if (result.error) alert(result.error);
        }}
      >
        حذف
      </Button>
    </div>
  );
}
