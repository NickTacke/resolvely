import { Sidebar } from "~/components/dashboard/sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell = ({ children }: DashboardShellProps) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-12 lg:col-span-3">
        <Sidebar />
      </aside>
      <main className="col-span-12 lg:col-span-9">{children}</main>
    </div>
  );
};