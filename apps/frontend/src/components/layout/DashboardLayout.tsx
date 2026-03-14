import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { HexagonBackground } from "../ui/hexagon-background";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <HexagonBackground 
      hexagonSize={100} 
      hexagonMargin={4}
      className="min-h-screen flex"
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 overflow-x-hidden">
          {children}
        </main>
      </div>
    </HexagonBackground>
  );
}
