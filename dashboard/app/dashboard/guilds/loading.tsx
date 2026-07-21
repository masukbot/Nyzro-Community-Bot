import React from "react";
import { ServerCardSkeleton } from "@/components/dashboard/server-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function GuildsLoading() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ServerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
