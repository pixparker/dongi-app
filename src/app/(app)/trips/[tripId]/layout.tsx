import { BottomNav } from "@/components/layout/bottom-nav";

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  return (
    <div className="min-h-screen bg-bg flex flex-col direction-rtl">
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
      <BottomNav tripId={tripId} />
    </div>
  );
}
