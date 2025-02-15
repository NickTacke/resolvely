// app/tickets/create/page.tsx
import CreateTicketForm from "./CreateTicketForm";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";

const CreateTicketPage = () => {
  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Ticket</CardTitle>
        </CardHeader>
        <CreateTicketForm />
      </Card>
    </div>
  );
};

export default CreateTicketPage;
