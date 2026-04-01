import { Skeleton } from "@/components/ui/skeleton";

function MemberCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl py-3.5 px-4 border border-border mb-2">
      <div className="flex items-center gap-3.5">
        <Skeleton className="w-[42px] h-[42px] rounded-full shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-1.5" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}

export default function MembersLoading() {
  return (
    <>
      {/* PageHeader skeleton */}
      <div className="px-5 pt-2 pb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-7 w-24" />
        </div>
      </div>

      <div className="px-5 pb-6">
        <MemberCardSkeleton />
        <MemberCardSkeleton />
        <MemberCardSkeleton />

        {/* Invite link card skeleton */}
        <div className="bg-card rounded-2xl p-4 border border-border mt-4">
          <Skeleton className="h-3.5 w-32 mb-2" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </>
  );
}
