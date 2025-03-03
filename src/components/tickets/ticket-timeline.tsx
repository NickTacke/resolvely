"use client";

import React from "react";
import { 
  Box, 
  Circle, 
  Clock, 
  FileCheck, 
  MessageSquare, 
  Tag, 
  UserPlus 
} from "lucide-react";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";

interface Ticket {
  id: string;
  title: string;
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

interface TimelineEvent {
  id: string;
  type: string;
  timestamp: Date;
  actor?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  data?: any;
}

interface TicketTimelineProps {
  ticket: Ticket;
}

export function TicketTimeline({ ticket }: TicketTimelineProps) {
  // Create a timeline from the ticket data
  // In a real app, you'd likely have a proper activity log in the database
  // This is a simplified example that reconstructs a timeline from available data
  const generateTimeline = (ticket: Ticket): TimelineEvent[] => {
    const timeline: TimelineEvent[] = [];
    
    // Add ticket creation event
    timeline.push({
      id: `creation-${ticket.id}`,
      type: "ticket_created",
      timestamp: new Date(ticket.createdAt),
      actor: ticket.createdBy,
      data: {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
      },
    });
    
    // Add assignment event if assigned
    if (ticket.assignedTo) {
      timeline.push({
        id: `assigned-${ticket.id}`,
        type: "ticket_assigned",
        // Use a timestamp slightly after creation
        timestamp: new Date(new Date(ticket.createdAt).getTime() + 60000),
        actor: ticket.createdBy, // Assume creator assigned it
        data: {
          assignee: ticket.assignedTo,
        },
      });
    }
    
    // Add status changes based on the current status
    // This is simulated - in a real app you'd have actual status change records
    if (ticket.status.name.toLowerCase() !== "new" && ticket.status.name.toLowerCase() !== "open") {
      timeline.push({
        id: `status-${ticket.id}`,
        type: "status_changed",
        // Use a timestamp between creation and last update
        timestamp: new Date(
          new Date(ticket.createdAt).getTime() + 
          (new Date(ticket.updatedAt).getTime() - new Date(ticket.createdAt).getTime()) / 2
        ),
        actor: ticket.assignedTo || ticket.createdBy,
        data: {
          newStatus: ticket.status.name,
        },
      });
    }
    
    // Add priority change event if not default
    if (ticket.priority.name.toLowerCase() !== "normal" && ticket.priority.name.toLowerCase() !== "medium") {
      timeline.push({
        id: `priority-${ticket.id}`,
        type: "priority_changed",
        // Use a timestamp between creation and status change
        timestamp: new Date(
          new Date(ticket.createdAt).getTime() + 
          (new Date(ticket.updatedAt).getTime() - new Date(ticket.createdAt).getTime()) / 3
        ),
        actor: ticket.assignedTo || ticket.createdBy,
        data: {
          newPriority: ticket.priority.name,
        },
      });
    }
    
    // Add comment events
    if (ticket.comments) {
      ticket.comments.forEach((comment) => {
        timeline.push({
          id: `comment-${comment.id}`,
          type: "comment_added",
          timestamp: new Date(comment.createdAt),
          actor: comment.author,
          data: {
            commentId: comment.id,
            commentPreview: comment.content.substring(0, 50) + (comment.content.length > 50 ? "..." : ""),
          },
        });
      });
    }
    
    // Sort the timeline by timestamp (newest first)
    return timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const timeline = generateTimeline(ticket);
  
  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };
  
  // Get icon for event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case "ticket_created":
        return <Box className="h-4 w-4" />;
      case "ticket_assigned":
        return <UserPlus className="h-4 w-4" />;
      case "status_changed":
        return <FileCheck className="h-4 w-4" />;
      case "priority_changed":
        return <Tag className="h-4 w-4" />;
      case "comment_added":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };
  
  // Get event description
  const getEventDescription = (event: TimelineEvent) => {
    const actorName = event.actor?.name || event.actor?.email || "Unknown user";
    
    switch (event.type) {
      case "ticket_created":
        return (
          <>
            <span className="font-medium">{actorName}</span> created this ticket
          </>
        );
      case "ticket_assigned":
        return (
          <>
            <span className="font-medium">{actorName}</span> assigned this ticket to{" "}
            <span className="font-medium">
              {event.data.assignee.name || event.data.assignee.email}
            </span>
          </>
        );
      case "status_changed":
        return (
          <>
            <span className="font-medium">{actorName}</span> changed status to{" "}
            <Badge variant="outline" className="ml-1">
              {event.data.newStatus}
            </Badge>
          </>
        );
      case "priority_changed":
        return (
          <>
            <span className="font-medium">{actorName}</span> changed priority to{" "}
            <Badge variant="outline" className="ml-1">
              {event.data.newPriority}
            </Badge>
          </>
        );
      case "comment_added":
        return (
          <>
            <span className="font-medium">{actorName}</span> commented:{" "}
            <span className="text-muted-foreground">
              {event.data.commentPreview}
            </span>
          </>
        );
      default:
        return <span>Unknown event</span>;
    }
  };

  return (
    <div className="space-y-4">
      {timeline.length > 0 ? (
        <div className="space-y-4">
          {timeline.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {event.actor ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={event.actor.image || ""} />
                      <AvatarFallback>
                        {event.actor.name
                          ? event.actor.name.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      {getEventIcon(event.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-1">
                    <div className="text-sm">{getEventDescription(event)}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatDate(event.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="p-8 text-center text-muted-foreground">
            <p>No activity recorded yet.</p>
          </div>
        </Card>
      )}
    </div>
  );
}