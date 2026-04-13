"use client";

import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/avatar";
import { useSession } from "@/hooks/use-session";
import { logout } from "@/app/(auth)/actions";

export default function UserSettingsPage() {
  const { profile, isLoading } = useSession();

  const displayName = profile?.display_name ?? profile?.username ?? "...";

  return (
    <div className="h-full flex flex-col bg-bg direction-rtl">
      <PageHeader title="تنظیمات" backHref="/trips" />

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div className="flex flex-col items-center mb-6">
          <Avatar name={displayName} size={72} />
          <p className="text-text-primary font-bold text-lg mt-3 mb-0">
            {isLoading ? "..." : displayName}
          </p>
        </div>

        <InputField label="نام کاربری" placeholder="ali_traveler" icon="👤" />
        <InputField label="رمز عبور فعلی" placeholder="••••••••" type="password" icon="🔒" />
        <InputField label="رمز عبور جدید" placeholder="••••••••" type="password" icon="🔒" />

        <Button full size="md" className="mt-4">
          ذخیره تغییرات
        </Button>

        <form action={logout}>
          <Button full variant="ghost" size="md" className="mt-3">
            خروج از حساب
          </Button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          نسخه {process.env.NEXT_PUBLIC_APP_VERSION}
        </p>
      </div>
    </div>
  );
}
