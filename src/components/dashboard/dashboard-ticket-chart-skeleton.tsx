"use client";

import React from "react";
import { Skeleton } from "~/components/ui/skeleton";

export function DashboardTicketChartSkeleton() {
  return (
    <div className="h-[300px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-x-2">
          <Skeleton className="inline-block h-5 w-20" />
          <Skeleton className="inline-block h-5 w-20" />
        </div>
      </div>

      <div className="h-[240px] flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full">
          <Skeleton className="h-full w-full rounded-md" />
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default DashboardTicketChartSkeleton;