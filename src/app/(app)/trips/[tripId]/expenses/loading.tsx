import { Skeleton } from "@/components/ui/skeleton";

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
            <Skeleton className="h-2.5 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExpensesLoading() {
  return (
    <div className="min-h-screen bg-bg direction-rtl">
      {/* PageHeader skeleton */}
      <div className="px-5 pt-2 pb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-7 w-20" />
        </div>
      </div>

      <div className="px-5 pb-6">
        <ExpenseCardSkeleton />
        <ExpenseCardSkeleton />
        <ExpenseCardSkeleton />
        <ExpenseCardSkeleton />

        <div className="mt-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
