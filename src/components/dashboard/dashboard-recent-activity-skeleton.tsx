"use client";

import React from "react";
import { Skeleton } from "~/components/ui/skeleton";

export function DashboardRecentActivitySkeleton() {
  return (
    <div className="space-y-4">
      {Array(5).fill(0).map((_, index) => (
        <div key={index} className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="grid gap-0.5 text-sm flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="ml-auto rounded-full h-6 w-6" />
        </div>
      ))}
      <div className="mt-4 text-center">
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  );
}

export default DashboardRecentActivitySkeleton;