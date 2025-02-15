// app/tickets/page.tsx
"use client";

import React from "react";
import { api } from "~/trpc/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

const TicketsPage = () => {
  const { data, isLoading, isError } = api.ticket.getTickets.useQuery();
  const tickets: any = data;

  if (isLoading) {
    return <p>Loading tickets...</p>;
  }

  if (isError) {
    return <p>Error loading tickets!</p>;
  }

  if (!tickets || tickets.length === 0) {
    return <p className="text-center text-gray-500">No tickets found.</p>;
  }

  return (
    <div>
      <h1 className="mb-4 text-3xl font-semibold">Ticket Overview</h1>
      <Button
        onClick={() => {
          redirect("/tickets/create");
        }}
      >
        Create
      </Button>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket: any) => (
          <Card
            key={ticket.id}
            className="bg-card text-card-foreground shadow-md"
          >
            <CardHeader>
              <CardTitle>
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="hover:underline"
                >
                  {ticket.title}
                </Link>
              </CardTitle>
              <CardDescription>
                Created: {ticket.createdAt.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="truncate text-sm text-muted-foreground">
                {ticket.description || "No description"}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant="secondary">{ticket.priority.name}</Badge>
                <Badge variant="outline">{ticket.status.name}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;
