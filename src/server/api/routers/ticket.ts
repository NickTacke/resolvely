import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const ticketRouter = createTRPCRouter({
  // Create a new ticket
  createTicket: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, { message: "Title is required!" }).max(255),
        description: z.string().optional(),
        statusId: z.string().optional(),
        priorityId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      try {
        // Use default status and priority if not provided
        const defaultStatusId = input.statusId || "NEW"; // assuming "NEW" is your default status ID
        const defaultPriorityId = input.priorityId || "NORMAL"; // assuming "NORMAL" is your default priority ID

        const ticket = await ctx.db.ticket.create({
          data: {
            title: input.title,
            description: input.description,
            statusId: defaultStatusId,
            priorityId: defaultPriorityId,
            createdById: userId,
          },
        });
        return ticket;
      } catch (err) {
        console.error("Error creating ticket:", err);
        throw new Error("Failed to create ticket!");
      }
    }),

  // Get all tickets
  getTickets: protectedProcedure.query(async ({ ctx }) => {
    try {
      const tickets = await ctx.db.ticket.findMany({
        include: {
          status: true,
          priority: true,
          assignedTo: true,
          createdBy: true,
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

  // Get a ticket by ID
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
            createdBy: true,
            comments: {
              include: { 
                author: true,
              },
              orderBy: {
                createdAt: "asc", // Oldest first
              },
            },
          },
        });
        return ticket;
      } catch (err) {
        console.error(`Error fetching ticket ${input.id}: ${err}`);
        throw new Error("Error fetching ticket!");
      }
    }),

  // Update a ticket
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
            createdBy: true,
            comments: {
              include: { author: true },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });
        return updatedTicket;
      } catch (err) {
        console.error(`Error updating ticket ${input.id}: ${err}`);
        throw new Error("Error updating ticket!");
      }
    }),

  // Delete a ticket
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

  // Add a comment to a ticket
  addComment: protectedProcedure
    .input(
      z.object({
        ticketId: z.string().min(1, { message: "Ticket ID is required!" }),
        content: z.string().min(1, { message: "Comment content is required!" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      try {
        const comment = await ctx.db.comment.create({
          data: {
            content: input.content,
            ticketId: input.ticketId,
            authorId: userId,
          },
          include: {
            author: true,
          },
        });
        return comment;
      } catch (err) {
        console.error("Error adding comment:", err);
        throw new Error("Failed to add comment!");
      }
    }),

  // Get dashboard stats
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx;
    
    // Get total tickets count
    const totalTickets = await db.ticket.count();
    
    // Get open tickets count
    const openTickets = await db.ticket.count({
      where: { 
        status: { 
          name: { 
            in: ["NEW", "OPEN"], 
            mode: "insensitive" 
          } 
        } 
      },
    });

    // Get open tickets count
    const inProgressTickets = await db.ticket.count({
      where: { 
        status: { 
          name: { 
            in: ["IN PROGRESS"], 
            mode: "insensitive"
          } 
        } 
      },
    });
    
    // Get closed tickets count
    const closedTickets = await db.ticket.count({
      where: { 
        status: { 
          name: { 
            in: ["RESOLVED", "CLOSED", "COMPLETED"], 
            mode: "insensitive" 
          } 
        } 
      },
    });
    
    // Get user count
    const users = await db.user.count();
    
    // Calculate weekly changes
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const openLastWeek = await db.ticket.count({
      where: { 
        status: { 
          name: { 
            in: ["NEW", "OPEN", "In Progress"], 
            mode: "insensitive" 
          } 
        },
        createdAt: { lt: oneWeekAgo }
      }
    });
    
    const closedLastWeek = await db.ticket.count({
      where: { 
        status: { 
          name: { 
            in: ["RESOLVED", "CLOSED", "COMPLETED"], 
            mode: "insensitive" 
          } 
        },
        updatedAt: { lt: oneWeekAgo }
      }
    });
    
    const weeklyOpenChange = openTickets - openLastWeek;
    const weeklyClosedChange = closedTickets - closedLastWeek;
    
    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      closedTickets,
      users,
      weeklyOpenChange,
      weeklyClosedChange
    };
  }),
  
  // Get recent tickets
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
  
  // Get ticket distribution data
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

  // Get analytics data
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

  // Get all statuses
  getStatuses: protectedProcedure.query(async ({ ctx }) => {
    try {
      const statuses = await ctx.db.ticketStatus.findMany({
        orderBy: {
          name: "asc",
        },
      });
      return statuses;
    } catch (err) {
      console.error("Error fetching statuses:", err);
      throw new Error("Error fetching statuses!");
    }
  }),

  // Get all priorities
  getPriorities: protectedProcedure.query(async ({ ctx }) => {
    try {
      const priorities = await ctx.db.ticketPriority.findMany({
        orderBy: {
          name: "asc",
        },
      });
      return priorities;
    } catch (err) {
      console.error("Error fetching priorities:", err);
      throw new Error("Error fetching priorities!");
    }
  }),
  
  // Get tickets assigned to the logged-in user
  getAssignedTickets: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    try {
      const tickets = await ctx.db.ticket.findMany({
        where: {
          assignedToId: userId,
        },
        include: {
          status: true,
          priority: true,
          assignedTo: true,
          createdBy: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return tickets;
    } catch (err) {
      console.error("Error fetching assigned tickets:", err);
      throw new Error("Error fetching assigned tickets!");
    }
  }),

  getActivityLog: protectedProcedure
  .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
  .query(async ({ ctx, input }) => {
    const { db } = ctx;
    
    // First let's get the most recent tickets
    const recentTickets = await db.ticket.findMany({
      take: input.limit,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: true,
        assignedTo: true,
        status: true,
        priority: true
      }
    });
    
    // Then get recent comments
    const recentComments = await db.comment.findMany({
      take: input.limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        ticket: true
      }
    });
    
    // Now let's transform these into activity items
    const ticketActivities = recentTickets.map(ticket => ({
      id: `ticket-${ticket.id}`,
      type: "ticket-created",
      timestamp: ticket.createdAt,
      actor: ticket.createdBy,
      data: {
        ticketId: ticket.id,
        ticketTitle: ticket.title
      }
    }));
    
    const commentActivities = recentComments.map(comment => ({
      id: `comment-${comment.id}`,
      type: "comment-added",
      timestamp: comment.createdAt,
      actor: comment.author,
      data: {
        ticketId: comment.ticketId,
        ticketTitle: comment.ticket.title,
        commentId: comment.id,
        commentPreview: comment.content.substring(0, 50) + (comment.content.length > 50 ? "..." : "")
      }
    }));
    
    // Get some status changes - this is a simplified approach
    // In a real app, you would track all status changes in a separate table
    const assignmentChanges = await db.ticket.findMany({
      where: {
        assignedToId: { not: null }
      },
      take: input.limit,
      orderBy: { updatedAt: "desc" },
      include: {
        assignedTo: true,
        createdBy: true
      }
    });
    
    const assignmentActivities = assignmentChanges.map(ticket => ({
      id: `assignment-${ticket.id}`,
      type: "ticket-assigned",
      timestamp: ticket.updatedAt,
      actor: ticket.createdBy,
      data: {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        assignee: ticket.assignedTo
      }
    }));
    
    // Combine and sort all activities by timestamp (newest first)
    const allActivities = [
      ...ticketActivities,
      ...commentActivities,
      ...assignmentActivities
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Take only the most recent activity items
    return allActivities.slice(0, input.limit);
  }),

// Add this endpoint to get users for ticket assignment
getUsers: protectedProcedure.query(async ({ ctx }) => {
  const { db } = ctx;
  
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true
      },
      orderBy: {
        name: "asc"
      }
    });
    
    return users;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Error fetching users!");
  }
}),

// Add a teams endpoint if needed
getTeams: protectedProcedure.query(async ({ ctx }) => {
  // In a real app, you would have a teams table
  // For now, we'll return a simple mock response that could be replaced
  // with real data when you implement teams functionality
  return [
    {
      id: "team-1",
      name: "Resolvely",
      logo: "TicketCheck", // Frontend will map this string to the actual icon
      plan: "Enterprise"
    }
  ];
}),

// Add a getTicketTimeline endpoint
getTicketTimeline: protectedProcedure
  .input(z.object({ 
    ticketId: z.string().min(1, { message: "Ticket ID is required!" }) 
  }))
  .query(async ({ ctx, input }) => {
    const { db } = ctx;
    
    // Get the ticket with all related data
    const ticket = await db.ticket.findUnique({
      where: { id: input.ticketId },
      include: {
        createdBy: true,
        assignedTo: true,
        status: true,
        priority: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: "asc" }
        }
      }
    });
    
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    
    // Create a timeline from real data
    const timeline = [];
    
    // Add ticket creation event
    timeline.push({
      id: `creation-${ticket.id}`,
      type: "ticket_created",
      timestamp: ticket.createdAt,
      actor: ticket.createdBy,
      data: {
        ticketId: ticket.id,
        ticketTitle: ticket.title
      }
    });
    
    // Add assignment event if assigned
    if (ticket.assignedTo) {
      timeline.push({
        id: `assigned-${ticket.id}`,
        type: "ticket_assigned",
        timestamp: ticket.updatedAt,
        actor: ticket.createdBy, // This is an assumption, in a real app you'd track who made the assignment
        data: {
          assignee: ticket.assignedTo
        }
      });
    }
    
    // Add status and priority information
    timeline.push({
      id: `status-${ticket.id}`,
      type: "status_changed",
      timestamp: ticket.updatedAt,
      actor: ticket.assignedTo || ticket.createdBy,
      data: {
        newStatus: ticket.status.name
      }
    });
    
    timeline.push({
      id: `priority-${ticket.id}`,
      type: "priority_changed",
      timestamp: ticket.updatedAt,
      actor: ticket.assignedTo || ticket.createdBy,
      data: {
        newPriority: ticket.priority.name
      }
    });
    
    // Add comment events
    ticket.comments.forEach(comment => {
      timeline.push({
        id: `comment-${comment.id}`,
        type: "comment_added",
        timestamp: comment.createdAt,
        actor: comment.author,
        data: {
          commentId: comment.id,
          commentPreview: comment.content.substring(0, 50) + (comment.content.length > 50 ? "..." : "")
        }
      });
    });
    
    // Sort the timeline by timestamp (newest first)
    return timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  })
});