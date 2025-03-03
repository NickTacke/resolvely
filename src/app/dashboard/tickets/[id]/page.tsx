import { SidebarInset } from "~/components/ui/sidebar";
import { TicketDetail } from "~/components/tickets/ticket-detail";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

// Generate dynamic metadata for the page
export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  
  try {
    const ticket = await api.ticket.getTicketById({ id });
    
    if (!ticket) {
      return {
        title: "Ticket Not Found",
      };
    }
    
    return {
      title: `${ticket.title} - Ticket #${id.substring(0, 8)}`,
      description: ticket.description?.substring(0, 160) || "No description provided.",
    };
  } catch (error) {
    return {
      title: "Ticket Details",
      description: "View and manage ticket details",
    };
  }
}

export default async function TicketPage({ params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    // Server-side data fetching for initial load
    const ticket = await api.ticket.getTicketById({ id });
    
    if (!ticket) {
      notFound();
    }
    
    // Get lists of statuses and priorities for dropdown options
    const statuses = await api.ticket.getStatuses();
    const priorities = await api.ticket.getPriorities();
    
    return (
      <SidebarInset>
        <TicketDetail 
          initialTicket={ticket} 
          statuses={statuses || []} 
          priorities={priorities || []} 
        />
      </SidebarInset>
    );
  } catch (error) {
    notFound();
  }
}