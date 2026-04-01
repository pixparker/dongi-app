import { Skeleton } from "@/components/ui/skeleton";

function MemberBalanceSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-3 border border-border mb-2">
      <div className="flex items-center gap-3">
        <Skeleton className="w-[38px] h-[38px] rounded-full shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <div className="flex justify-between mt-1.5">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpenseCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-3 border border-border mb-2">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          <div className="flex justify-between mt-1.5">
            <Skeleton className="h-2.5 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TripDashboardLoading() {
  return (
    <>
      {/* PageHeader skeleton */}
      <div className="px-5 pt-2 pb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-7 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-14" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Total Card skeleton */}
        <div className="bg-accent/8 border border-accent/20 rounded-[18px] p-5 mb-4 text-center">
          <Skeleton className="h-3 w-24 mx-auto mb-2" />
          <Skeleton className="h-9 w-36 mx-auto mb-1" />
          <Skeleton className="h-3 w-12 mx-auto" />
          <div className="flex justify-center gap-4 mt-3.5 pt-3.5 border-t border-accent/15">
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-2.5 w-14" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="w-px bg-accent/15" />
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-2.5 w-14" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>

        {/* Members Balance section */}
        <Skeleton className="h-4 w-20 mb-2.5" />
        <MemberBalanceSkeleton />
        <MemberBalanceSkeleton />
        <MemberBalanceSkeleton />

        {/* Recent Expenses section */}
        <Skeleton className="h-4 w-24 mt-4 mb-2.5" />
        <ExpenseCardSkeleton />
        <ExpenseCardSkeleton />

        <div className="h-4" />
      </div>
    </>
  );
}
