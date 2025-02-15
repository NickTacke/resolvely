'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { useRouter } from 'next/navigation';

// Define Zod schema for the form input (must match backend input schema)
const createTicketSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(255),
  description: z.string().optional(),
});

type CreateTicketInputType = z.infer<typeof createTicketSchema>; // Infer type from Zod schema

const CreateTicketForm: React.FC = () => {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketInputType>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createTicketMutation = api.ticket.createTicket.useMutation({
    onSuccess: (createdTicket: any) => {
      console.log("Ticket created successfully:", createdTicket);
      setSuccessMessage(`Ticket "${createdTicket.title}" created successfully!`);
      setErrorMessage(null);
      reset(); // Clear the form
      // Optionally: Redirect to ticket list page or ticket detail page
      router.push(createdTicket.id);
    },
    onError: (error: any) => {
      console.error("Ticket creation failed:", error);
      setErrorMessage(error.toString());
      setSuccessMessage(null);
    },
  });

  const onSubmit: SubmitHandler<CreateTicketInputType> = async (data) => {
    setSuccessMessage(null); // Clear previous messages
    setErrorMessage(null);

    const createdTicketId = createTicketMutation.mutate(data); // Call the tRPC mutation
  };

  return (
    <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {successMessage && <div className="text-green-500">{successMessage}</div>}
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}

            <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Ticket Title" {...register("title")} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" placeholder="Detailed description" {...register("description")} />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Ticket"}
            </Button>
        </form>
    </CardContent>
  );
};

export default CreateTicketForm;