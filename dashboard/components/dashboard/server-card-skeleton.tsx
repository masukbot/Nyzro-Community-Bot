import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const ServerCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn(
      "bg-[#141B2D] border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl shadow-black/40 h-full flex flex-col",
      className
    )}>
      <div className="p-4 sm:p-8 flex-grow">
        <div className="flex items-start justify-between mb-6 sm:mb-8">
          <div className="relative">
            <Skeleton className="h-15 w-15 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl" />
          </div>
          <div className="flex flex-col items-end text-right gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-24 sm:w-36 rounded-xl" />
          </div>
        </div>
        <div>
          <Skeleton className="h-8 w-48 sm:w-64 mb-6 sm:mb-8" />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Skeleton className="h-10 w-32 sm:w-36 rounded-2xl" />
            <Skeleton className="h-10 w-28 sm:w-32 rounded-2xl" />
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-8 py-4 sm:py-6 bg-slate-900/40 border-t border-slate-800/50">
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
};
