"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { joinTrip } from "../actions";

export function JoinButton({ inviteCode }: { inviteCode: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    setLoading(true);
    const result = await joinTrip(inviteCode);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      <Button full size="lg" onClick={handleJoin} disabled={loading}>
        {loading ? "..." : "پیوستن به سفر"}
      </Button>
    </>
  );
}
