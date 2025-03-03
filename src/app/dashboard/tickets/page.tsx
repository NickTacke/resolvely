"use client";

import React, { useState } from "react";
import { 
  BarChart, 
  CheckCircle, 
  ChevronDown, 
  FileDown, 
  Filter, 
  Plus, 
  Search, 
  SlidersHorizontal,
  Clock,
  AlertCircle 
} from "lucide-react";
import { api } from "~/trpc/react";
import { SidebarInset } from "~/components/ui/sidebar";
import { DashboardHeader } from "~/components/dashboard/dashboard-header";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function TicketsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Separate query for statistics - this will load first
  const { data: stats, isLoading: isLoadingStats } = api.ticket.getStats.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  
  // Query for ticket data - this might take longer to load
  const { data: tickets, isLoading: isLoadingTickets } = api.ticket.getTickets.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // Mock statuses and priorities (in a real app, these would come from the API)
  const statuses = [
    { value: "NEW", label: "New" },
    { value: "OPEN", label: "Open" },
    { value: "INPROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CLOSED", label: "Closed" }
  ];
  
  const priorities = [
    { value: "LOW", label: "Low" },
    { value: "NORMAL", label: "Normal" },
    { value: "HIGH", label: "High" },
    { value: "URGENT", label: "Urgent" }
  ];

  // Filter and sort the tickets
  const filteredTickets = tickets
    ? tickets.filter(ticket => {
        // Search filter
        const matchesSearch = !searchQuery || 
          ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Status filter
        const matchesStatus = statusFilter.length === 0 || 
          statusFilter.some(status => ticket.status.name.toUpperCase() === status);
        
        // Priority filter
        const matchesPriority = priorityFilter.length === 0 || 
          priorityFilter.some(priority => ticket.priority.name.toUpperCase() === priority);
        
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        // Sort by the selected field
        if (sortBy === "createdAt") {
          return sortOrder === "asc" 
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        
        if (sortBy === "priority") {
          const priorityOrder: Record<string, number> = { 
            "URGENT": 4, 
            "HIGH": 3, 
            "NORMAL": 2, 
            "MEDIUM": 2, // Alternative name
            "LOW": 1 
          };
          
          const aPriority = priorityOrder[a.priority.name.toUpperCase()] || 0;
          const bPriority = priorityOrder[b.priority.name.toUpperCase()] || 0;
          
          return sortOrder === "asc" 
            ? aPriority - bPriority 
            : bPriority - aPriority;
        }
        
        if (sortBy === "status") {
          const statusOrder: Record<string, number> = { 
            "NEW": 1, 
            "OPEN": 2, 
            "IN_PROGRESS": 3, 
            "RESOLVED": 4, 
            "CLOSED": 5 
          };
          
          const aStatus = statusOrder[a.status.name.toUpperCase()] || 0;
          const bStatus = statusOrder[b.status.name.toUpperCase()] || 0;
          
          return sortOrder === "asc" 
            ? aStatus - bStatus 
            : bStatus - aStatus;
        }
        
        // Default to sort by title
        return sortOrder === "asc" 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      })
    : [];

  // Get badge variants
  const getBadgeVariantForPriority = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    const priorityLower = priority.toLowerCase();
    if (priorityLower === "high" || priorityLower === "urgent") return "destructive";
    if (priorityLower === "medium" || priorityLower === "normal") return "default";
    if (priorityLower === "low") return "secondary";
    return "outline";
  };
  
  const getBadgeVariantForStatus = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const statusLower = status.toLowerCase();
    if (statusLower === "open" || statusLower === "new") return "default";
    if (statusLower === "in progress") return "secondary";
    if (statusLower === "resolved" || statusLower === "closed" || statusLower === "completed") return "outline";
    return "outline";
  };

  // Pagination logic (basic implementation)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil((filteredTickets?.length || 0) / itemsPerPage);
  
  const paginatedTickets = filteredTickets?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  return (
    <SidebarInset>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <DashboardHeader heading="Tickets" text="Manage and track support tickets">
          <Button size="sm" onClick={() => router.push("/dashboard/tickets/create")}>
            <Plus className="mr-2 h-4 w-4" /> New Ticket
          </Button>
        </DashboardHeader>
        
        {/* Stats - These will load first */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tickets
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats?.totalTickets || 0
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New & Open
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats?.openTickets || 0
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                In Progress
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats?.inProgressTickets || 0
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resolved
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats?.closedTickets || 0
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tickets..."
                className="w-full pl-8 md:max-w-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline-block">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                {statuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status.value}
                    checked={statusFilter.includes(status.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, status.value]);
                      } else {
                        setStatusFilter(statusFilter.filter((s) => s !== status.value));
                      }
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    {status.label}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                {priorities.map((priority) => (
                  <DropdownMenuCheckboxItem
                    key={priority.value}
                    checked={priorityFilter.includes(priority.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPriorityFilter([...priorityFilter, priority.value]);
                      } else {
                        setPriorityFilter(priorityFilter.filter((p) => p !== priority.value));
                      }
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    {priority.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline-block">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={sortBy === "createdAt"}
                  onCheckedChange={() => {
                    setSortBy("createdAt");
                    if (sortBy === "createdAt") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortOrder("desc");
                    }
                  }}
                >
                  Date {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "priority"}
                  onCheckedChange={() => {
                    setSortBy("priority");
                    if (sortBy === "priority") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortOrder("desc");
                    }
                  }}
                >
                  Priority {sortBy === "priority" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "status"}
                  onCheckedChange={() => {
                    setSortBy("status");
                    if (sortBy === "status") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortOrder("asc");
                    }
                  }}
                >
                  Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortBy === "title"}
                  onCheckedChange={() => {
                    setSortBy("title");
                    if (sortBy === "title") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortOrder("asc");
                    }
                  }}
                >
                  Title {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <FileDown className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <BarChart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Analytics</span>
            </Button>
          </div>
        </div>
        
        {/* Tickets Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Priority</TableHead>
                <TableHead className="hidden md:table-cell">Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingTickets ? (
                // Loading skeletons for table
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="mx-auto h-5 w-20" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="mx-auto h-5 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                // Actual tickets
                paginatedTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell 
                      className="font-medium"
                      onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                    >
                      {ticket.id.slice(0, 8)}
                    </TableCell>
                    <TableCell 
                      className="hidden md:table-cell"
                      onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                    >
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell 
                      className="font-medium"
                      onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                    >
                      <Link 
                        href={`/dashboard/tickets/${ticket.id}`}
                        className="hover:text-primary hover:underline"
                      >
                        {ticket.title}
                      </Link>
                      <div className="block text-xs text-muted-foreground md:hidden">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell 
                      className="text-center"
                      onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                    >
                      <Badge
                        variant={getBadgeVariantForStatus(ticket.status.name)}
                        className="inline-block"
                      >
                        {ticket.status.name}
                      </Badge>
                    </TableCell>
                    <TableCell 
                      className="text-center"
                      onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                    >
                      <Badge
                        variant={getBadgeVariantForPriority(ticket.priority.name)}
                        className="inline-block"
                      >
                        {ticket.priority.name}
                      </Badge>
                    </TableCell>
                    <TableCell 
                      className="hidden md:table-cell"
                      onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
                    >
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={ticket.assignedTo.image || ""}
                              alt={ticket.assignedTo.name || ""}
                            />
                            <AvatarFallback>
                              {ticket.assignedTo.name
                                ? ticket.assignedTo.name.charAt(0).toUpperCase()
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {ticket.assignedTo.name || ticket.assignedTo.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {!isLoadingTickets && totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic to show pages around current page
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNumber);
                      }}
                      isActive={pageNumber === currentPage}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </SidebarInset>
  );
}