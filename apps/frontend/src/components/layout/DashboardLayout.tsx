import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { HexagonBackground } from "../ui/hexagon-background";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <div className="fixed inset-0 z-0">
        <HexagonBackground hexagonSize={100} hexagonMargin={4} />
      </div>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto">
        <Topbar />
        <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
