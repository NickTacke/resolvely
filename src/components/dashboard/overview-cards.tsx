import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Ticket } from "lucide-react"; // Or relevant icons

interface OverviewCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

const OverviewCard = ({ title, value, icon }: OverviewCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);


export const OverviewCards = async () => {
  // --- Replace this with your trpc data fetching ---
  const overviewData = {
    totalTickets: 150,
    openTickets: 35,
    resolvedTickets: 115,
  };
  // --- End of dummy data ---

  return (
    <>
      <OverviewCard
        title="Total Tickets"
        value={overviewData.totalTickets.toString()}
        icon={<Ticket className="w-4 h-4 text-muted-foreground" />}
      />
      <OverviewCard
        title="Open Tickets"
        value={overviewData.openTickets.toString()}
        icon={<Ticket className="w-4 h-4 text-muted-foreground" />}
      />
      <OverviewCard
        title="Resolved Tickets"
        value={overviewData.resolvedTickets.toString()}
        icon={<Ticket className="w-4 h-4 text-muted-foreground" />}
      />
      {/* Add more cards as needed */}
    </>
  );
};