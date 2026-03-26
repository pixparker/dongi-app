"use client";

import { use, useEffect, useState } from "react";
import { useActionState } from "react";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/client";
import { updateTrip, deleteTrip, type TripActionResult } from "../../actions";

export default function TripSettingsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const [trip, setTrip] = useState<{ name: string; currency: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [state, formAction, pending] = useActionState<TripActionResult, FormData>(
    (_prev, formData) => updateTrip(tripId, formData),
    {}
  );

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("trips")
      .select("name, currency")
      .eq("id", tripId)
      .single()
      .then(({ data }) => {
        if (data) setTrip(data);
      });
  }, [tripId]);

  async function handleDelete() {
    if (!confirm("آیا مطمئنید؟ این عملیات قابل بازگشت نیست.")) return;
    setDeleting(true);
    await deleteTrip(tripId);
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-bg direction-rtl">
        <PageHeader title="تنظیمات سفر" backHref={`/trips/${tripId}`} />
        <div className="px-5 py-8 text-center text-text-muted">...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="تنظیمات سفر" backHref={`/trips/${tripId}`} />

      <div className="px-5 pb-6">
        <form action={formAction}>
          <InputField label="نام سفر" name="name" defaultValue={trip.name} icon="✏️" required />
          <InputField label="واحد پول" name="currency" defaultValue={trip.currency} icon="💱" />

          {state.error && (
            <p className="text-danger text-sm mb-3">{state.error}</p>
          )}

          <div className="mt-6 space-y-3">
            <Button full variant="primary" size="md" disabled={pending}>
              {pending ? "..." : "ذخیره تغییرات"}
            </Button>
          </div>
        </form>

        <div className="mt-3">
          <Button full variant="danger" size="md" onClick={handleDelete} disabled={deleting}>
            {deleting ? "..." : "حذف سفر"}
          </Button>
        </div>
      </div>
    </div>
  );
}
