import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import Link from "next/link";
import { BarChart3, TicketCheck, Users, Activity } from "lucide-react";
import { api } from "~/trpc/server";

// Import client components instead of direct Recharts imports
import StatusPieChart from "~/components/charts/status-pie-chart";
import PriorityBarChart from "~/components/charts/priority-bar-chart";
import AnalyticsChart from "~/components/charts/analytics-chart";

export default async function Page() {
  // Fetch data from your tRPC API
  const stats = await api.ticket.getStats();
  const recentTickets = await api.ticket.getRecent({ limit: 3 });
  const ticketDistribution = await api.ticket.getDistribution();
  const analyticsData = await api.ticket.getAnalytics().catch(() => ({ ticketsOverTime: [] }));
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Stat cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/30">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <TicketCheck className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.totalTickets}</div>
                <p className="text-xs text-muted-foreground">All tickets in the system</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-950/30">
                <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                <Activity className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.openTickets}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.weeklyOpenChange > 0 ? `+${stats.weeklyOpenChange}` : stats.weeklyOpenChange} since last week
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/30">
                <CardTitle className="text-sm font-medium">Closed Tickets</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.closedTickets}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.weeklyClosedChange > 0 ? `+${stats.weeklyClosedChange}` : stats.weeklyClosedChange} since last week
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/30">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold">{stats.users}</div>
                <p className="text-xs text-muted-foreground">Active users</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent tickets */}
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <Card className="col-span-1 hover:shadow-md transition-all">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950/30">
                <CardTitle>Recent Tickets</CardTitle>
                <CardDescription>Latest tickets created in the system</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {recentTickets.length > 0 ? (
                    recentTickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between border-b pb-2 group">
                        <div className="space-y-1">
                          <Link href={`/dashboard/tickets/${ticket.id}`} className="font-medium group-hover:text-primary group-hover:underline transition-colors">
                            {ticket.title}
                          </Link>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            {ticket.assignedTo && (
                              <span>• Assigned to: {ticket.assignedTo.name}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
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
                    <div className="text-center py-4 text-muted-foreground">No recent tickets found</div>
                  )}
                  <div className="mt-4 text-center">
                    <Link 
                      href="/dashboard/tickets" 
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      View all tickets
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 hover:shadow-md transition-all">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950/30">
                <CardTitle>Ticket Distribution</CardTitle>
                <CardDescription>Tickets by priority and status</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] pt-4">
                {ticketDistribution ? (
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-center">By Status</h4>
                      {/* Use client component instead of direct Recharts */}
                      <StatusPieChart 
                        data={ticketDistribution.byStatus as any[]} 
                        colors={COLORS} 
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-center">By Priority</h4>
                      {/* Use client component instead of direct Recharts */}
                      <PriorityBarChart 
                        data={ticketDistribution.byPriority as any[]} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No distribution data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950/30">
              <CardTitle>Ticket Analytics</CardTitle>
              <CardDescription>Ticket trends and metrics over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] pt-4">
              <div className="h-full">
                {analyticsData.ticketsOverTime && (analyticsData.ticketsOverTime as any[]).length > 0 ? (
                  <AnalyticsChart data={analyticsData.ticketsOverTime as any[]} />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No analytics data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions for badge styling
function getBadgeVariantForPriority(priority: string): "default" | "secondary" | "destructive" | "outline" {
  switch (priority.toLowerCase()) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "outline";
  }
}

function getBadgeVariantForStatus(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "open":
      return "default";
    case "in progress":
      return "secondary";
    case "closed":
      return "outline";
    default:
      return "outline";
  }
}
