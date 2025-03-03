// TODO: Add better error handling
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const ticketRouter = createTRPCRouter({
  createTicket: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, { message: "Title is required!" }).max(255),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      try {
        const ticket = await ctx.db.ticket.create({
          data: {
            title: input.title,
            description: input.description,
            statusId: "NEW",
            priorityId: "NORMAL",
            createdById: userId,
          },
        });
        return ticket;
      } catch (err) {
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
          assignedTo: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return tickets;
    } catch (err) {
      console.error("Error fetching tickets:", err);
      throw new Error("Error fetching tickets!");
    }
  }),

  getTicketById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "ID is required!" }),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const ticket = await ctx.db.ticket.findUnique({
          where: {
            id: input.id,
          },
          include: {
            status: true,
            priority: true,
            assignedTo: true,
            comments: {
              include: { author: true },
            },
          },
        });
        return ticket;
      } catch (err) {
        console.error(`Error fetching ticket ${input.id}: ${err}`);
        throw new Error("Error fetching ticket!");
      }
    }),

  updateTicket: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "ID is required!" }),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        statusId: z.string().optional(),
        priorityId: z.string().optional(),
        assignedToId: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedTicket = await ctx.db.ticket.update({
          where: { id: input.id },
          data: {
            ...(input.title !== undefined && { title: input.title }),
            ...(input.description !== undefined && {
              description: input.description,
            }),
            ...(input.statusId !== undefined && { statusId: input.statusId }),
            ...(input.priorityId !== undefined && {
              priorityId: input.priorityId,
            }),
            ...(input.assignedToId !== undefined && {
              assignedToId: input.assignedToId,
            }),
            updatedAt: new Date(),
          },
          include: {
            status: true,
            priority: true,
            assignedTo: true,
            comments: {
              include: { author: true },
            },
          },
        });
        return updatedTicket;
      } catch (err) {
        console.error(`Error updating ticket ${input.id}: ${err}`);
        throw new Error("Error updating ticket!");
      }
    }),

  deleteTicket: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "ID is required!" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const deleted = await ctx.db.ticket.delete({
          where: { id: input.id },
        });
        return deleted;
      } catch (err) {
        console.error(`Error deleting ticket ${input.id}: ${err}`);
        throw new Error("Error deleting ticket!");
      }
    }),

    getStats: protectedProcedure.query(async ({ ctx }) => {
      const { db } = ctx;
      
      // Get total tickets count
      const totalTickets = await db.ticket.count();
      
      // Get open tickets count
      const openTickets = await db.ticket.count({
        where: { statusId: { notIn: ["COMPLETED"] } } // Assuming 3 is the ID for "COMPLETED" status
      });
      
      // Get closed tickets count
      const closedTickets = await db.ticket.count({
        where: { statusId: "COMPLETED" } // Assuming 3 is the ID for "COMPLETED" status
      });
      
      // Get user count
      const users = await db.user.count();
      
      // Calculate weekly changes (example implementation)
      // This is a simplified example - you'd typically compare with data from a week ago
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const openLastWeek = await db.ticket.count({
        where: { 
          statusId: { notIn: ["COMPLETED"] },
          createdAt: { lt: oneWeekAgo }
        }
      });
      
      const closedLastWeek = await db.ticket.count({
        where: { 
          statusId: "COMPLETED",
          updatedAt: { lt: oneWeekAgo }
        }
      });
      
      const weeklyOpenChange = openTickets - openLastWeek;
      const weeklyClosedChange = closedTickets - closedLastWeek;
      
      return {
        totalTickets,
        openTickets,
        closedTickets,
        users,
        weeklyOpenChange,
        weeklyClosedChange
      };
    }),
    
    getRecent: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(50).default(5) }))
      .query(async ({ ctx, input }) => {
        const { db } = ctx;
        
        return await db.ticket.findMany({
          take: input.limit,
          orderBy: { createdAt: "desc" },
          include: {
            priority: true,
            status: true,
            assignedTo: true
          }
        });
      }),
    
    getDistribution: protectedProcedure.query(async ({ ctx }) => {
      const { db } = ctx;
      
      // Get ticket counts by status
      const statusCounts = await db.$queryRaw`
        SELECT ts.name as status, COUNT(*) as count
        FROM "Ticket" t 
        JOIN "TicketStatuses" ts ON t."statusId" = ts.id
        GROUP BY ts.name
      `;
      
      // Get ticket counts by priority
      const priorityCounts = await db.$queryRaw`
        SELECT tp.name as priority, COUNT(*) as count
        FROM "Ticket" t 
        JOIN "TicketPriorities" tp ON t."priorityId" = tp.id
        GROUP BY tp.name
      `;
      
      // Convert BigInt to Number
      const formattedStatusCounts = Array.isArray(statusCounts) 
        ? statusCounts.map(item => ({
            status: item.status,
            count: typeof item.count === 'bigint' ? Number(item.count) : item.count
          }))
        : [];

      const formattedPriorityCounts = Array.isArray(priorityCounts)
        ? priorityCounts.map(item => ({
            priority: item.priority,
            count: typeof item.count === 'bigint' ? Number(item.count) : item.count
          }))
        : [];
      
      return {
        byStatus: formattedStatusCounts,
        byPriority: formattedPriorityCounts
      };
    }),

    getAnalytics: protectedProcedure.query(async ({ ctx }) => {
      const { db } = ctx;
      
      const ticketsOverTime = await db.$queryRaw`
        SELECT 
          to_char(t."createdAt", 'YYYY-MM') as period,
          COUNT(CASE WHEN t."statusId" != 'COMPLETED' THEN 1 END) as opened,
          COUNT(CASE WHEN t."statusId" = 'COMPLETED' THEN 1 END) as completed
        FROM "Ticket" t
        WHERE t."createdAt" > current_date - interval '6 months'
        GROUP BY to_char(t."createdAt", 'YYYY-MM')
        ORDER BY period ASC
      `;
      
      console.log(ticketsOverTime);

      // Convert BigInt to Number
      const formattedData = Array.isArray(ticketsOverTime)
        ? ticketsOverTime.map(item => ({
            period: item.period,
            opened: typeof item.opened === 'bigint' ? Number(item.opened) : item.opened || 0,
            completed: typeof item.completed === 'bigint' ? Number(item.completed) : item.completed || 0
          }))
        : [];
      
      return {
        ticketsOverTime: formattedData
      };
    }),
});
