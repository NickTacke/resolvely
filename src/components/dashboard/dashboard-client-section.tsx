"use client";

import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  TicketIcon,
  User as UserIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";
import { DashboardTicketChartSkeleton } from "./dashboard-ticket-chart-skeleton";
import { DashboardRecentActivitySkeleton } from "./dashboard-recent-activity-skeleton";

// Dynamically import heavy components
const DashboardTicketChart = dynamic(
  () => import("./dashboard-ticket-chart"),
  { 
    loading: () => <DashboardTicketChartSkeleton />,
    ssr: false
  }
);

const DashboardRecentActivity = dynamic(
  () => import("./dashboard-recent-activity"),
  { 
    loading: () => <DashboardRecentActivitySkeleton />,
    ssr: false
  }
);

interface DashboardClientSectionProps {
  stats: {
    totalTickets: number;
    openTickets: number;
    closedTickets: number;
    users: number;
    weeklyOpenChange: number;
    weeklyClosedChange: number;
  };
  distribution: {
    byStatus: Array<{ status: string; count: number }>;
    byPriority: Array<{ priority: string; count: number }>;
  };
  recentTickets: Array<any>; // Using any here for simplicity, but you should define a proper type
}

export function DashboardClientSection({ stats, distribution, recentTickets }: DashboardClientSectionProps) {
  // Helper functions for badge styling
  function getBadgeVariantForPriority(priority: string): "default" | "secondary" | "destructive" | "outline" {
    const priorityLower = priority.toLowerCase();
    if (priorityLower === "high" || priorityLower === "urgent") return "destructive";
    if (priorityLower === "medium" || priorityLower === "normal") return "default";
    if (priorityLower === "low") return "secondary";
    return "outline";
  }
  
  function getBadgeVariantForStatus(status: string): "default" | "secondary" | "destructive" | "outline" {
    const statusLower = status.toLowerCase();
    if (statusLower === "open" || statusLower === "new") return "default";
    if (statusLower === "in progress") return "secondary";
    if (statusLower === "resolved" || statusLower === "closed" || statusLower === "completed") return "outline";
    return "outline";
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <TicketIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTickets}</div>
              <p className="text-xs text-muted-foreground">All tickets in the system</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openTickets}</div>
              <p className="text-xs text-muted-foreground">
                {stats.weeklyOpenChange > 0 
                  ? `+${stats.weeklyOpenChange}` 
                  : stats.weeklyOpenChange} since last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Tickets</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.closedTickets}</div>
              <p className="text-xs text-muted-foreground">
                {stats.weeklyClosedChange > 0 
                  ? `+${stats.weeklyClosedChange}` 
                  : stats.weeklyClosedChange} since last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
              <p className="text-xs text-muted-foreground">Active support agents</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Suspense fallback={<DashboardTicketChartSkeleton />}>
                  <DashboardTicketChart distribution={distribution} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your team's latest activity</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<DashboardRecentActivitySkeleton />}>
                  <DashboardRecentActivity />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
              <CardDescription>Recently created and updated tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTickets.length > 0 ? (
                  recentTickets.map((ticket) => (
                    <div key={ticket.id} className="flex justify-between gap-2 group border-b pb-4 last:pb-0 last:border-b-0">
                      <div className="space-y-1">
                        <Link
                          href={`/dashboard/tickets/${ticket.id}`}
                          className="font-medium group-hover:text-primary group-hover:underline transition-colors"
                        >
                          {ticket.title}
                        </Link>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          {ticket.assignedTo && (
                            <span>• Assigned to: {ticket.assignedTo.name}</span>
                          )}
                        </div>
                        <p className="line-clamp-1 max-w-lg text-sm text-muted-foreground mt-1">
                          {ticket.description || "No description provided."}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant={getBadgeVariantForPriority(ticket.priority.name)}>
                          {ticket.priority.name}
                        </Badge>
                        <Badge variant={getBadgeVariantForStatus(ticket.status.name)}>
                          {ticket.status.name}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent tickets found. Create your first ticket!
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/tickets">
                <Button variant="outline" className="w-full">View All Tickets</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Ticket Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of ticket performance
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Analytics charts will appear here
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="reports" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                Export and review detailed reports
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Reports will appear here
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}