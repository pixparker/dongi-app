"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

export function CopyInviteCard({ inviteUrl }: { inviteUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="mt-5 text-center">
      <p className="text-[13px] text-text-muted m-0 mb-2.5">🔗 لینک دعوت</p>
      <div
        className="bg-input-bg rounded-[10px] px-3.5 py-2.5 text-xs text-accent mb-2.5 break-all cursor-pointer"
        dir="ltr"
        onClick={handleCopy}
      >
        {inviteUrl}
      </div>
      <button
        onClick={handleCopy}
        className="bg-accent text-bg px-3.5 py-2 text-xs rounded-[10px] font-bold cursor-pointer border-none"
      >
        {copied ? "✓ کپی شد" : "کپی لینک"}
      </button>
    </Card>
  );
}
