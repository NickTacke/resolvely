import {
    LayoutDashboard,
    Ticket,
    Settings,
  } from "lucide-react"; // Assuming you have lucide-react installed for icons
  import { SidebarNavItem } from "~/components/dashboard/sidebar-nav-item";
  
  export const Sidebar = () => {
    return (
      <div className="hidden lg:block fixed h-full"> {/* Fixed sidebar for larger screens */}
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Dashboard
            </h2>
            <div className="space-y-1">
              <SidebarNavItem href="/dashboard" icon={LayoutDashboard}>
                Overview
              </SidebarNavItem>
              <SidebarNavItem href="/dashboard/tickets" icon={Ticket}>
                Tickets
              </SidebarNavItem>
              {/* Add more navigation items here */}
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Settings
            </h2>
            <div className="space-y-1">
              <SidebarNavItem href="/dashboard/settings" icon={Settings}>
                General
              </SidebarNavItem>
              {/* Add more settings items here */}
            </div>
          </div>
        </div>
      </div>
    );
  };