import { auth } from "~/server/auth";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { User } from "next-auth";
import DashboardBreadcrumbs from "./dash-breadcrumbs";


interface DashboardProps {
    children: React.ReactNode
}

const Dashboard = async (props: DashboardProps) => {

    const session = await auth();

    const userData: User = {
      id: session?.user.id,
      name: session?.user.name,
      image: session?.user.image,
      email: session?.user.email,
    };

    return (
        <SidebarProvider>
        {session?.user !== undefined ? (
          <AppSidebar user={userData}></AppSidebar>
        ) : (
          <></>
        )}
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DashboardBreadcrumbs />
            </div>
          </header>
          <SidebarContent>
            {props.children}
          </SidebarContent>
        </SidebarInset>
      </SidebarProvider>
    );
}

export default Dashboard;