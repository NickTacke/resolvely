"use client";

import React from "react";
import { ArrowRight, Box, Circle, Clock, FileCheck, MessageSquare, Tag, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";

// Updated to use the API instead of mock data
function DashboardRecentActivity() {
  // Fetch recent activity from the API
  const { data: activityItems, isLoading, error } = api.ticket.getActivityLog.useQuery(
    { limit: 5 },
    {
      refetchOnWindowFocus: false,
    }
  );

  function timeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  function getActivityIcon(type: string) {
    switch (type) {
      case "ticket-created":
        return <Box className="h-4 w-4" />;
      case "ticket-assigned":
        return <UserPlus className="h-4 w-4" />;
      case "comment-added":
        return <MessageSquare className="h-4 w-4" />;
      case "status_changed":
      case "ticket-resolved":
        return <FileCheck className="h-4 w-4" />;
      case "priority_changed":
      case "ticket-priority":
        return <Tag className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  }

  function getActivityMessage(item: any) {
    const actorName = item.actor?.name || item.actor?.email || "Unknown user";
    
    switch (item.type) {
      case "ticket-created":
        return (
          <>
            <span className="font-medium">{actorName}</span> created ticket{" "}
            <Link href={`/dashboard/tickets/${item.data.ticketId}`} className="font-medium text-primary hover:underline">
              {item.data.ticketTitle}
            </Link>
          </>
        );
      case "ticket-assigned":
        return (
          <>
            <span className="font-medium">{actorName}</span> assigned{" "}
            <Link href={`/dashboard/tickets/${item.data.ticketId}`} className="font-medium text-primary hover:underline">
              {item.data.ticketTitle}
            </Link>{" "}
            to <span className="font-medium">
              {item.data.assignee?.name || item.data.assignee?.email || "a team member"}
            </span>
          </>
        );
      case "comment-added":
        return (
          <>
            <span className="font-medium">{actorName}</span> commented on{" "}
            <Link href={`/dashboard/tickets/${item.data.ticketId}`} className="font-medium text-primary hover:underline">
              {item.data.ticketTitle}
            </Link>
            {item.data.commentPreview && (
              <>: <span className="text-muted-foreground">{item.data.commentPreview}</span></>
            )}
          </>
        );
      case "status_changed":
        return (
          <>
            <span className="font-medium">{actorName}</span> changed status to{" "}
            <span className="font-medium">{item.data.newStatus}</span>
          </>
        );
      case "priority_changed":
        return (
          <>
            <span className="font-medium">{actorName}</span> set priority to{" "}
            <span className="font-medium">{item.data.newPriority}</span>
          </>
        );
      default:
        return "Unknown activity";
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="grid gap-0.5 text-sm flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="ml-auto rounded-full h-6 w-6" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Error loading activities: {error.message}</div>;
  }

  if (!activityItems || activityItems.length === 0) {
    return <div className="text-center text-muted-foreground">No recent activity found.</div>;
  }

  return (
    <div className="space-y-4">
      {activityItems.map(item => (
        <div key={item.id} className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.actor?.image || ""} alt={item.actor?.name || ""} />
            <AvatarFallback>
              {item.actor?.name 
                ? item.actor.name.split(" ").map(n => n[0]).join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5 text-sm">
            <div className="line-clamp-2">
              {getActivityMessage(item)}
            </div>
            <div className="text-xs text-muted-foreground">
              {timeAgo(item.timestamp)}
            </div>
          </div>
          <div className="ml-auto rounded-full bg-muted p-1.5 text-muted-foreground">
            {getActivityIcon(item.type)}
          </div>
        </div>
      ))}
      <div className="mt-4 text-center">
        <Link 
          href="/dashboard/activity" 
          className="text-sm text-muted-foreground inline-flex items-center hover:text-primary hover:underline"
        >
          View all activity <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export { DashboardRecentActivity };
export default DashboardRecentActivity;