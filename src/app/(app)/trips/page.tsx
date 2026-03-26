"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MOCK_TRIPS = [
  {
    id: "1",
    name: "سفر شمال",
    members: 5,
    total: "۱۲,۵۰۰,۰۰۰",
    currency: "﷼",
    color: "#00D68F",
    emoji: "🏖️",
  },
  {
    id: "2",
    name: "سفر استانبول",
    members: 4,
    total: "۸,۴۰۰",
    currency: "₺",
    color: "#6B8AFF",
    emoji: "🕌",
  },
  {
    id: "3",
    name: "کمپ جنگل",
    members: 6,
    total: "۴,۲۰۰,۰۰۰",
    currency: "﷼",
    color: "#FFB547",
    emoji: "⛺",
  },
];

export default function TripsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="سفرهای من" />

      <div className="px-5 pb-6">
        {MOCK_TRIPS.map((trip) => (
          <Card
            key={trip.id}
            className="mb-3"
            onClick={() => router.push(`/trips/${trip.id}`)}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center text-[26px] shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${trip.color}22, ${trip.color}11)`,
                  border: `1px solid ${trip.color}33`,
                }}
              >
                {trip.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-text-primary m-0">
                  {trip.name}
                </h3>
                <div className="flex gap-3 mt-1.5">
                  <span className="text-xs text-text-muted">
                    👥 {trip.members} نفر
                  </span>
                  <span className="text-xs text-text-muted">
                    💰 {trip.total} {trip.currency}
                  </span>
                </div>
              </div>
              <span className="text-text-muted text-lg">←</span>
            </div>
          </Card>
        ))}

        <div className="mt-5">
          <Link href="/trips/new">
            <Button full size="lg">
              + سفر جدید
            </Button>
          </Link>
        </div>

        <Card className="mt-4 text-center">
          <p className="text-[13px] text-text-muted m-0">🔗 لینک دعوت دارید؟</p>
          <Button variant="ghost" size="sm" className="mt-2">
            پیوستن به سفر
          </Button>
        </Card>
      </div>
    </div>
  );
}
