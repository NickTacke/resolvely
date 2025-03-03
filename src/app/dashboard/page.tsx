import { Metadata } from "next";
import { Suspense } from "react";
import {
  Plus,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { SidebarInset } from "~/components/ui/sidebar";
import { api } from "~/trpc/server";
import Link from "next/link";
import { DashboardHeader } from "~/components/dashboard/dashboard-header";
import { auth } from "~/server/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DashboardClientSection } from "~/components/dashboard/dashboard-client-section";

export const metadata: Metadata = {
  title: "Dashboard | Resolvely",
  description: "Support ticket dashboard for Resolvely",
};

// This component will load separately from the server
async function StatsData() {
  const stats = await api.ticket.getStats();
  return stats;
}

// This component will load separately from the server
async function DistributionData() {
  const distribution = await api.ticket.getDistribution();
  return distribution;
}

// This component will load separately from the server
async function RecentTicketsData() {
  const recentTickets = await api.ticket.getRecent({ limit: 5 });
  return recentTickets;
}

// Main dashboard page (Server Component)
export default async function DashboardPage() {
  const session = await auth();
  
  // Fetch data in parallel
  const statsPromise = StatsData();
  const distributionPromise = DistributionData();
  const recentTicketsPromise = RecentTicketsData();
  
  // Use Promise.all to fetch all data concurrently
  const [stats, distribution, recentTickets] = await Promise.all([
    statsPromise,
    distributionPromise, 
    recentTicketsPromise
  ]);

  return (
    <SidebarInset className="flex-1">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <DashboardHeader
          heading="Dashboard"
          text={`Welcome back, ${session?.user?.name || "User"}`}
        >
          <Link href="/dashboard/tickets/create">
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-flex">New Ticket</span>
            </Button>
          </Link>
        </DashboardHeader>

        {/* Pass the preloaded data to client component */}
        <DashboardClientSection 
          stats={stats} 
          distribution={distribution}
          recentTickets={recentTickets}
        />
      </div>
    </SidebarInset>
  );
}