import { Skeleton } from "@/components/ui/skeleton";

function SettlementCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border mb-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
          <div>
            <Skeleton className="h-3.5 w-16 mb-1" />
            <Skeleton className="h-2.5 w-10" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-end">
            <Skeleton className="h-3.5 w-16 mb-1" />
            <Skeleton className="h-2.5 w-10" />
          </div>
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        </div>
      </div>
      <Skeleton className="h-8 w-full rounded-xl mt-3" />
    </div>
  );
}

export default function PaymentsLoading() {
  return (
    <>
      {/* PageHeader skeleton */}
      <div className="px-5 pt-2 pb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-7 w-24" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Summary card skeleton */}
        <div className="bg-accent/8 border border-accent/15 rounded-2xl p-[18px] mb-5 text-center">
          <Skeleton className="h-3.5 w-48 mx-auto mb-2" />
          <Skeleton className="h-8 w-20 mx-auto" />
        </div>

        <SettlementCardSkeleton />
        <SettlementCardSkeleton />
      </div>
    </>
  );
}
