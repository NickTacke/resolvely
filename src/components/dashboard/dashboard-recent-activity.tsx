"use client";

import React from "react";
import { ArrowRight, Box, Circle, Clock, FileCheck, MessageSquare, Tag, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";

// This is a placeholder component that would ideally use real activity data
// We'll simulate activity for now, but in a real app it would come from an API
function DashboardRecentActivity() {
  const activityItems = [
    {
      id: 1,
      type: "ticket-created",
      user: {
        name: "John Doe",
        email: "john@example.com",
        image: ""
      },
      ticket: {
        id: "T-1234",
        title: "Login issue after update"
      },
      timestamp: new Date(Date.now() - 45 * 60000)
    },
    {
      id: 2,
      type: "ticket-assigned",
      user: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        image: ""
      },
      assignee: {
        name: "Mike Wilson",
        email: "mike@example.com",
      },
      ticket: {
        id: "T-1233",
        title: "Dashboard showing error"
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60000)
    },
    {
      id: 3,
      type: "comment-added",
      user: {
        name: "Alex Turner",
        email: "alex@example.com",
        image: ""
      },
      ticket: {
        id: "T-1230",
        title: "Feature request: dark mode"
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60000)
    },
    {
      id: 4,
      type: "ticket-resolved",
      user: {
        name: "Mike Wilson",
        email: "mike@example.com",
        image: ""
      },
      ticket: {
        id: "T-1228",
        title: "Payment not processing"
      },
      timestamp: new Date(Date.now() - 12 * 60 * 60000)
    },
    {
      id: 5,
      type: "ticket-priority",
      user: {
        name: "Lisa Chen",
        email: "lisa@example.com",
        image: ""
      },
      ticket: {
        id: "T-1226",
        title: "API Integration failure"
      },
      priority: "HIGH",
      timestamp: new Date(Date.now() - 24 * 60 * 60000)
    }
  ];

  function timeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
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
      case "ticket-resolved":
        return <FileCheck className="h-4 w-4" />;
      case "ticket-priority":
        return <Tag className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  }

  function getActivityMessage(item: any) {
    switch (item.type) {
      case "ticket-created":
        return (
          <>
            <span className="font-medium">{item.user.name}</span> created ticket{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              {item.ticket.title}
            </Link>
          </>
        );
      case "ticket-assigned":
        return (
          <>
            <span className="font-medium">{item.user.name}</span> assigned{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              {item.ticket.title}
            </Link>{" "}
            to <span className="font-medium">{item.assignee.name}</span>
          </>
        );
      case "comment-added":
        return (
          <>
            <span className="font-medium">{item.user.name}</span> commented on{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              {item.ticket.title}
            </Link>
          </>
        );
      case "ticket-resolved":
        return (
          <>
            <span className="font-medium">{item.user.name}</span> resolved{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              {item.ticket.title}
            </Link>
          </>
        );
      case "ticket-priority":
        return (
          <>
            <span className="font-medium">{item.user.name}</span> set priority to{" "}
            <span className="font-medium text-destructive">{item.priority}</span> for{" "}
            <Link href="#" className="font-medium text-primary hover:underline">
              {item.ticket.title}
            </Link>
          </>
        );
      default:
        return "Unknown activity";
    }
  }

  return (
    <div className="space-y-4">
      {activityItems.map(item => (
        <div key={item.id} className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.user.image} alt={item.user.name} />
            <AvatarFallback>
              {item.user.name.split(" ").map(n => n[0]).join("")}
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