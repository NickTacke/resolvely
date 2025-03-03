"use client";

import {
  PlusCircle,
  Search,
  FileText,
  Settings2,
  HelpCircle,
  BarChart2,
  AlertCircle,
  type LucideIcon
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import Link from "next/link";

interface QuickLinkItem {
  name: string;
  url: string;
  icon: LucideIcon;
  description?: string;
}

export function QuickLinks() {
  const { isMobile } = useSidebar();

  const quickLinks: QuickLinkItem[] = [
    {
      name: "Create Ticket",
      url: "/dashboard/tickets/create",
      icon: PlusCircle,
      description: "Create a new support ticket"
    },
    {
      name: "Search Tickets",
      url: "/dashboard/tickets?action=search",
      icon: Search,
      description: "Search through all tickets"
    },
    {
      name: "Documentation",
      url: "/dashboard/docs",
      icon: FileText,
      description: "Help center and guides"
    },
    {
      name: "Report Issue",
      url: "/dashboard/report",
      icon: AlertCircle,
      description: "Report a problem with the system"
    }
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
      <SidebarMenu>
        {quickLinks.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton 
              asChild
              tooltip={item.description || item.name}
            >
              <Link href={item.url} prefetch={true}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}