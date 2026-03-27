"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function JoinTripButton() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  function handleJoin() {
    const trimmed = code.trim();
    if (!trimmed) return;
    // Support both full URL and just the code
    const inviteCode = trimmed.includes("/invite/")
      ? trimmed.split("/invite/").pop()!
      : trimmed;
    setOpen(false);
    router.push(`/invite/${inviteCode}`);
  }

  return (
    <>
      <Card className="mt-4 text-center">
        <p className="text-[13px] text-text-muted m-0">🔗 لینک دعوت دارید؟</p>
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => setOpen(true)}>
          پیوستن به سفر
        </Button>
      </Card>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-5"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl p-5 w-full max-w-sm direction-rtl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-text-primary mb-1 mt-0">پیوستن به سفر</h3>
            <p className="text-xs text-text-muted mb-4">کد دعوت یا لینک را وارد کنید</p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="مثلاً: n3k3fp یا لینک کامل"
              dir="ltr"
              autoFocus
              className="w-full bg-input-bg border border-border rounded-xl px-3.5 py-3 text-sm text-text-primary text-center outline-none placeholder:text-text-muted mb-4"
            />
            <div className="flex gap-2">
              <Button full size="md" onClick={handleJoin} disabled={!code.trim()}>
                ادامه
              </Button>
              <Button full variant="secondary" size="md" onClick={() => setOpen(false)}>
                انصراف
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
