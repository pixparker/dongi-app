"use client";

import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/avatar";

export default function UserSettingsPage() {
  return (
    <div className="min-h-screen bg-bg direction-rtl">
      <PageHeader title="تنظیمات" backHref="/trips" />

      <div className="px-5 pb-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar name="علی" size={72} />
          <p className="text-text-primary font-bold text-lg mt-3 mb-0">علی</p>
          <p className="text-text-muted text-sm m-0">ali_traveler</p>
        </div>

        <InputField label="نام کاربری" placeholder="ali_traveler" icon="👤" />
        <InputField label="رمز عبور فعلی" placeholder="••••••••" type="password" icon="🔒" />
        <InputField label="رمز عبور جدید" placeholder="••••••••" type="password" icon="🔒" />

        <Button full size="md" className="mt-4">
          ذخیره تغییرات
        </Button>

        <Button full variant="ghost" size="md" className="mt-3">
          خروج از حساب
        </Button>
      </div>
    </div>
  );
}
