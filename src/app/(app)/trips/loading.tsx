import { Skeleton } from "@/components/ui/skeleton";

function TripCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border mb-3">
      <div className="flex items-center gap-3.5">
        <Skeleton className="w-[50px] h-[50px] rounded-[14px] shrink-0" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-28 mb-2" />
          <div className="flex gap-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TripsLoading() {
  return (
    <div className="h-full flex flex-col bg-bg direction-rtl">
      {/* PageHeader skeleton */}
      <div className="px-5 pt-2 pb-3 flex items-center justify-between shrink-0">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <TripCardSkeleton />
        <TripCardSkeleton />
        <TripCardSkeleton />

        <div className="mt-5">
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
