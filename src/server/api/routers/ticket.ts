// TODO: Add better error handling
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const ticketRouter = createTRPCRouter({
    createTicket: protectedProcedure.input(z.object({
        title: z.string().min(1, {message: "Title is required!"}).max(255),
        description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user.id;

        try {
            const ticket = await ctx.db.ticket.create({
                data: {
                    title: input.title,
                    description: input.description,
                    statusId: "NEW",
                    priorityId: "NORMAL",
                    createdById: userId
                },
            });
            return ticket;
        } catch(err) {
            console.error("Error creating ticket:", err);
            throw new Error("Failed to create ticket!");
        }
    }),

    getTickets: protectedProcedure.query(async ({ ctx }) => {
        try {
            const tickets = await ctx.db.ticket.findMany({
                include: {
                    status: true,
                    priority: true,
                    assignedTo: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
            return tickets;
        } catch(err) {
            console.error("Error fetching tickets:", err);
            throw new Error("Error fetching tickets!");
        }
    }),

    getTicketById: protectedProcedure.input(z.object({
        id: z.string().min(1, {message: "ID is required!"})
    }))
    .query(async ({ ctx, input }) => {
        try {
            const ticket = await ctx.db.ticket.findUnique({
                where: {
                    id: input.id
                },
                include: {
                    status: true,
                    priority: true,
                    assignedTo: true,
                    comments: {
                        include: { author: true }
                    }
                }
            });
            return ticket;
        } catch(err) {
            console.error(`Error fetching ticket ${input.id}: ${err}`);
            throw new Error("Error fetching ticket!")
        }
    }),

    updateTicket: protectedProcedure.input(z.object({
        id: z.string().min(1, {message: "ID is required!"}),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        statusId: z.string().optional(),
        priorityId: z.string().optional(),
        assignedToId: z.string().optional().nullable()
    }))
    .mutation(async ({ ctx, input }) => {
        try {
            const updatedTicket = await ctx.db.ticket.update({
                where: { id: input.id },
                data: {
                    ...(input.title !== undefined && { title: input.title }),
                    ...(input.description !== undefined && { description: input.description }),
                    ...(input.statusId !== undefined && { statusId: input.statusId }),
                    ...(input.priorityId !== undefined && { priorityId: input.priorityId }),
                    ...(input.assignedToId !== undefined && { assignedToId: input.assignedToId }),
                    updatedAt: new Date()
                },
                include: {
                    status: true,
                    priority: true,
                    assignedTo: true,
                    comments: {
                        include: { author: true }
                    }
                }
            });
            return updatedTicket;
        } catch(err) {
            console.error(`Error updating ticket ${input.id}: ${err}`);
            throw new Error("Error updating ticket!")
        }
    }),

    deleteTicket: protectedProcedure.input(z.object({
        id: z.string().min(1, {message: "ID is required!"})
    }))
    .mutation(async ({ ctx, input }) => {
        try {
            const deleted = await ctx.db.ticket.delete({
                where: { id: input.id }
            })
            return deleted;
        } catch(err) {
            console.error(`Error deleting ticket ${input.id}: ${err}`);
            throw new Error("Error deleting ticket!")
        }
    })
});