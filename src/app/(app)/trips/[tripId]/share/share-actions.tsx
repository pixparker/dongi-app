"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareActions({ inviteUrl }: { inviteUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "دعوت به سفر - دنگی‌سفر",
          text: "بیا تو سفر ما! هزینه‌ها رو با هم حساب می‌کنیم 🎒",
          url: inviteUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  }

  return (
    <div className="flex gap-2">
      <Button full variant="primary" size="md" onClick={handleShare}>
        📤 اشتراک‌گذاری
      </Button>
      <Button full variant="secondary" size="md" onClick={handleCopy}>
        {copied ? "✓ کپی شد" : "📋 کپی لینک"}
      </Button>
    </div>
  );
}
