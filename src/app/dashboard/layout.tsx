import Dashboard from "~/components/dashboard/dashboard";
import React from "react";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <React.Fragment>
      <Dashboard children={children} />
    </React.Fragment>
  );
}