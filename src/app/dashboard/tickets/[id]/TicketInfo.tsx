'use client'
import { useParams } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

const TicketInfo = () => {
    const params = useParams<{ id: string }>(); // Get the ticket ID from URL params
    const ticketId = params.id;
  
    const {
      data: ticket,
      isLoading,
      isError,
    } = api.ticket.getTicketById.useQuery({
      id: ticketId,
    });
  
    if (isLoading) {
      return <p>Loading ticket details!</p>;
    }
  
    if (isError) {
      return <p>Failed to load ticket details!</p>;
    }
  
    if (!ticket) {
      return <p>{`Ticket with ID "${ticketId}" not found.`}</p>;
    }

    return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{ticket.title}</CardTitle>
          <CardDescription>
            Created: {ticket.createdAt.toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{ticket.priority.name}</Badge>
            <Badge variant="outline">{ticket.status.name}</Badge>
          </div>
          <h3 className="text-lg font-semibold">Description</h3>
          <Textarea
            className="text-muted-foreground"
            readOnly
            style={{ whiteSpace: "pre-line", resize: "none", height: "300px" }}
            value={ticket.description || "No description provided."}
          ></Textarea>

          {ticket.assignedTo && (
            <div>
              <h3 className="text-lg font-semibold">Assigned Agent</h3>
              <p className="text-muted-foreground">
                {ticket.assignedTo.name || ticket.assignedTo.email}
              </p>
            </div>
          )}

          {ticket.comments && ticket.comments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Comments</h3>
              <ul>
                {ticket.comments.map((comment) => (
                  <li key={comment.id} className="mb-2 rounded border p-2">
                    <p className="font-semibold">
                      {comment.author.name || comment.author.email}:
                    </p>
                    <p className="text-muted-foreground">{comment.content}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {comment.createdAt.toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    );
}

export default TicketInfo;