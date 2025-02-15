import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from "~/components/ui/table";
  
  interface RecentTicket {
    id: string;
    title: string;
    status: string;
    createdAt: string; // Or Date, adjust as needed
  }
  
  export const RecentTickets = async () => {
    // --- Replace this with your trpc data fetching ---
    const recentTicketsData: RecentTicket[] = [
      { id: "TKT-001", title: "Website down!", status: "Open", createdAt: "2023-10-27" },
      { id: "TKT-002", title: "Feature request: Dark Mode", status: "Pending", createdAt: "2023-10-26" },
      { id: "TKT-003", title: "Bug in checkout process", status: "Resolved", createdAt: "2023-10-25" },
      // ... more dummy data
    ];
    // --- End of dummy data ---
  
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Tickets</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTicketsData.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell className="text-right font-medium">{ticket.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };