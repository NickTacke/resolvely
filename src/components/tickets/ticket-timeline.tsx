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
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import Link from "next/link";

interface TicketTimelineProps {
  ticket: {
    id: string;
  };
}

export function TicketTimeline({ ticket }: TicketTimelineProps) {
  // Fetch timeline data from the API
  const { data: timeline, isLoading, isError } = api.ticket.getTicketTimeline.useQuery(
    { ticketId: ticket.id },
    { refetchOnWindowFocus: false }
  );
  
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
  const getEventDescription = (event: any) => {
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
              {event.data.assignee?.name || event.data.assignee?.email || "a team member"}
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <div className="p-8 text-center text-muted-foreground">
          <p>Error loading timeline data. Please try again later.</p>
        </div>
      </Card>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center text-muted-foreground">
          <p>No activity recorded yet.</p>
        </div>
      </Card>
    );
  }

  return (
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
  );
}