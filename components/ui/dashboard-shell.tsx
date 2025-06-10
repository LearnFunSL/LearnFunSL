import { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* You can add header, sidebar navigation, etc. here in the future */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
