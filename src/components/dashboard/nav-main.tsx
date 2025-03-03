"use client";

import { ChevronRight, type LucideIcon, BarChart3, LayoutDashboard, TicketIcon, Settings, Users, MessageSquare, UserCheck } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import Link from "next/link";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    isActive?: boolean;
  }[];
}

export function NavMain() {
  const pathname = usePathname();
  
  // Define navigation items with proper links to our app routes
  const items: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      title: "Tickets",
      url: "/dashboard/tickets",
      icon: TicketIcon,
      isActive: pathname.includes("/dashboard/tickets"),
      items: [
        {
          title: "All Tickets",
          url: "/dashboard/tickets",
          isActive: pathname === "/dashboard/tickets"
        },
        {
          title: "Create Ticket",
          url: "/dashboard/tickets/create",
          isActive: pathname === "/dashboard/tickets/create"
        },
        {
          title: "My Assigned Tickets",
          url: "/dashboard/tickets/assigned",
          isActive: pathname === "/dashboard/tickets/assigned"
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
      isActive: pathname.includes("/dashboard/analytics"),
      items: [
        {
          title: "Overview",
          url: "/dashboard/analytics",
          isActive: pathname === "/dashboard/analytics"
        },
        {
          title: "Performance",
          url: "/dashboard/analytics/performance",
          isActive: pathname === "/dashboard/analytics/performance"
        },
        {
          title: "Reports",
          url: "/dashboard/analytics/reports",
          isActive: pathname === "/dashboard/analytics/reports"
        },
      ],
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: Users,
      isActive: pathname.includes("/dashboard/team"),
      items: [
        {
          title: "Members",
          url: "/dashboard/team/members",
          isActive: pathname === "/dashboard/team/members"
        },
        {
          title: "Roles",
          url: "/dashboard/team/roles",
          isActive: pathname === "/dashboard/team/roles"
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      isActive: pathname.includes("/dashboard/settings"),
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
          isActive: pathname === "/dashboard/settings"
        },
        {
          title: "Security",
          url: "/dashboard/settings/security",
          isActive: pathname === "/dashboard/settings/security"
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
          isActive: pathname === "/dashboard/settings/notifications"
        },
      ],
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Resolvely</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items && item.items.length > 0 ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                            <Link href={subItem.url} prefetch={true}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                // For items without sub-items, use a Link component with prefetch
                <SidebarMenuButton 
                  asChild
                  tooltip={item.title} 
                  isActive={item.isActive}
                >
                  <Link href={item.url} prefetch={true}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}