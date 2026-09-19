import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-primary animate-pulse">
            Establishing Neural Link...
          </h2>
        </div>
      </div>
    );
  }

  // Bypass active: always grant access to the requested view
  return <>{children}</>;
}
