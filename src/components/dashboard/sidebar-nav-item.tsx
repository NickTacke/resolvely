import React from "react";
import Link from "next/link";
import { cn } from "~/lib/utils"; // Assuming you have your utils file for class merging
import { LucideIcon } from "lucide-react";

interface SidebarNavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  href: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export const SidebarNavItem = React.forwardRef<
  HTMLDivElement,
  SidebarNavItemProps
>(({ href, icon: Icon, children, className }) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md p-2 text-sm font-semibold hover:bg-secondary hover:text-primary",
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  );
});
SidebarNavItem.displayName = "SidebarNavItem";