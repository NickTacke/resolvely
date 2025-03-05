"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  Edit2,
  MoreHorizontal,
  Trash2,
  User,
  UserPlus,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "~/components/ui/tabs";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { TicketTimeline } from "~/components/tickets/ticket-timeline";
import { TicketComments } from "~/components/tickets/ticket-comments";

// Type definitions
interface Ticket {
  id: string;
  title: string;
  description: string | null;
  status: {
    id: string;
    name: string;
  };
  priority: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  assignedTo: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  createdBy: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  comments?: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
    createdAt: Date;
  }[];
}

interface StatusOption {
  id: string;
  name: string;
}

interface PriorityOption {
  id: string;
  name: string;
}

interface TicketDetailProps {
  initialTicket: Ticket;
  statuses: StatusOption[];
  priorities: PriorityOption[];
}

export function TicketDetail({ initialTicket, statuses, priorities }: TicketDetailProps) {
  const router = useRouter();
  
  // State for editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTicket.title);
  const [description, setDescription] = useState(initialTicket.description || "");
  const [selectedStatus, setSelectedStatus] = useState(initialTicket.status.id);
  const [selectedPriority, setSelectedPriority] = useState(initialTicket.priority.id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // State for comments
  const [newComment, setNewComment] = useState("");
  
  // Use tRPC to get the latest ticket data and handle updates
  const { data: ticket, isPending, isError, refetch } = api.ticket.getTicketById.useQuery(
    { id: initialTicket.id },
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: users, isPending: isPendingUsers } = api.ticket.getUsers.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false
    }
  );

  // tRPC mutations
  const updateTicketMutation = api.ticket.updateTicket.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditing(false);
    },
  });

  const deleteTicketMutation = api.ticket.deleteTicket.useMutation({
    onSuccess: () => {
      router.push("/dashboard/tickets");
    },
  });

  const addCommentMutation = api.ticket.addComment.useMutation({
    onSuccess: () => {
      refetch();
      setNewComment("");
    },
  });

  // Helper functions for badge colors
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

  // Handle form submission for updating the ticket
  const handleUpdateTicket = () => {
    updateTicketMutation.mutate({
      id: ticket?.id as string,
      title,
      description,
      statusId: selectedStatus,
      priorityId: selectedPriority,
    });
  };

  // Handle ticket deletion
  const handleDeleteTicket = () => {
    deleteTicketMutation.mutate({ id: ticket?.id as string });
  };

  // Handle submitting a new comment
  const handleSubmitComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate({
        ticketId: ticket?.id as string,
        content: newComment,
      });
    }
  };

  // Handle assigning the ticket
  const handleAssignTicket = (userId: string) => {
    updateTicketMutation.mutate({
      id: ticket?.id as string,
      assignedToId: userId,
    });
    setIsAssignDialogOpen(false);
  };

  // If we're still loading, show a skeleton UI
  if (isPending && !ticket) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-7">
          <div className="md:col-span-5 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  // If there was an error loading the ticket
  if (isError || !ticket) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/dashboard/tickets")}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tickets</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Ticket</CardTitle>
            <CardDescription>
              There was a problem loading this ticket. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/tickets")}>
              Return to Tickets List
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1" 
          onClick={() => router.push("/dashboard/tickets")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tickets</span>
        </Button>
        
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1" 
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setIsAssignDialogOpen(true)}
                    className="cursor-pointer"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Assign Ticket</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Ticket</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="default" 
                className="gap-1" 
                onClick={handleUpdateTicket}
                disabled={updateTicketMutation.isPending}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{updateTicketMutation.isPending ? "Saving..." : "Save Changes"}</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="gap-1" 
                onClick={() => {
                  setIsEditing(false);
                  setTitle(ticket.title);
                  setDescription(ticket.description || "");
                  setSelectedStatus(ticket.status.id);
                  setSelectedPriority(ticket.priority.id);
                }}
              >
                <X className="h-3.5 w-3.5" />
                <span>Cancel</span>
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-7">
        {/* Main content area */}
        <div className="md:col-span-5 space-y-4">
          <Card>
            <CardHeader>
              {isEditing ? (
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="text-xl font-semibold"
                  placeholder="Ticket title"
                />
              ) : (
                <CardTitle className="text-xl">{ticket.title}</CardTitle>
              )}
              <CardDescription>
                Created: {new Date(ticket.createdAt).toLocaleString()}
                {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                  <> • Updated: {new Date(ticket.updatedAt).toLocaleString()}</>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <>
                    <div className="w-full sm:w-auto">
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.id} value={status.id}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-full sm:w-auto">
                      <Select
                        value={selectedPriority}
                        onValueChange={setSelectedPriority}
                      >
                        <SelectTrigger className="w-full sm:w-32">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.id} value={priority.id}>
                              {priority.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <Badge variant={getBadgeVariantForStatus(ticket.status.name)}>
                      {ticket.status.name}
                    </Badge>
                    <Badge variant={getBadgeVariantForPriority(ticket.priority.name)}>
                      {ticket.priority.name}
                    </Badge>
                  </>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                {isEditing ? (
                  <Textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Enter ticket description"
                    className="min-h-[150px]"
                  />
                ) : (
                  <div className="rounded-md border bg-muted/40 p-4 text-sm">
                    {ticket.description ? (
                      <div className="whitespace-pre-wrap">{ticket.description}</div>
                    ) : (
                      <em className="text-muted-foreground">No description provided.</em>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="space-y-4 pt-4">
              <TicketComments 
                comments={ticket.comments || []} 
                onSubmitComment={handleSubmitComment}
                newComment={newComment}
                setNewComment={setNewComment}
                isSubmitting={addCommentMutation.isPending}
              />
            </TabsContent>
            <TabsContent value="activity" className="space-y-4 pt-4">
              <TicketTimeline ticket={ticket} />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Side panel */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Created by:</span>
                <span className="text-muted-foreground">
                  {ticket.createdBy ? (
                    ticket.createdBy.name || ticket.createdBy.email
                  ) : (
                    "Unknown"
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Created:</span>
                <span className="text-muted-foreground">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Last updated:</span>
                <span className="text-muted-foreground">
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Assigned to:</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs"
                    onClick={() => setIsAssignDialogOpen(true)}
                  >
                    Change
                  </Button>
                </div>
                
                {ticket.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={ticket.assignedTo.image || ""} />
                      <AvatarFallback>
                        {ticket.assignedTo.name
                          ? ticket.assignedTo.name.charAt(0).toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm">{ticket.assignedTo.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {ticket.assignedTo.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserPlus className="h-4 w-4" />
                    <span className="text-sm">Unassigned</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  const resolvedStatusId = statuses.find(
                    s => s.name.toLowerCase() === "resolved"
                  )?.id;
                  
                  if (resolvedStatusId) {
                    updateTicketMutation.mutate({
                      id: ticket.id,
                      statusId: resolvedStatusId,
                    });
                  }
                }}
                disabled={
                  ticket.status.name.toLowerCase() === "resolved" ||
                  ticket.status.name.toLowerCase() === "closed"
                }
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Resolved
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  const selectedStatusId = statuses.find(
                    s => s.name.toLowerCase() === "in progress"
                  )?.id;
                  
                  if (selectedStatusId) {
                    updateTicketMutation.mutate({
                      id: ticket.id,
                      statusId: selectedStatusId,
                    });
                  }
                }}
                disabled={ticket.status.name.toLowerCase() === "in progress"}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Mark as In Progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Delete Ticket
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ticket? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTicket}
              disabled={deleteTicketMutation.isPending}
            >
              {deleteTicketMutation.isPending ? "Deleting..." : "Delete Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Ticket Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogDescription>
              Select a team member to assign this ticket to.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isPendingUsers ? (
              // Loading skeleton
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex flex-col flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))}
              </>
            ) : users && users.length > 0 ? (
              // Display users from API
              <>
                {users.map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={() => handleAssignTicket(user.id)}
                  >
                    <Avatar>
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback>
                        {user.name
                          ? user.name.charAt(0).toUpperCase()
                          : user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name || "Unnamed User"}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // No users found
              <div className="text-center py-4 text-muted-foreground">
                No team members available for assignment.
              </div>
            )}
            
            <Separator />
            
            <div 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
              onClick={() => handleAssignTicket("")}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                <X className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">Unassign ticket</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}