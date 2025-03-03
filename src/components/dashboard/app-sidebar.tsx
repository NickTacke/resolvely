"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Ticket,
  TicketCheck,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { User } from "next-auth";

// This is sample data.
const data = {
  teams: [
    {
      name: "Resolvely",
      logo: TicketCheck,
      plan: "Trial",
    }
  ],
  navMain: [
    {
      title: "Tickets",
      url: "/tickets",
      icon: Ticket,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard/tickets",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    }
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User; // Add the user prop here and define its type (User interface we created above)
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // Destructure user from props

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} /> {/* Pass the user prop to NavUser */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
