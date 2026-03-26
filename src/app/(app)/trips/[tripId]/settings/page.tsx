"use client";

import { use } from "react";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

export default function TripSettingsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="تنظیمات سفر" backHref={`/trips/${tripId}`} />

      <div className="px-5 pb-6">
        <InputField label="نام سفر" placeholder="سفر استانبول" icon="✏️" />
        <InputField label="واحد پول" placeholder="₺ لیر" icon="💱" />

        <div className="mt-6 space-y-3">
          <Button full variant="primary" size="md">
            ذخیره تغییرات
          </Button>
          <Button full variant="danger" size="md">
            حذف سفر
          </Button>
        </div>
      </div>
    </div>
  );
}
