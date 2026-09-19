import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center font-rajdhani">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-sm font-display font-black uppercase tracking-[0.3em] text-white">
              Establishing Neural Link
            </h2>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest animate-pulse">
              Authenticating Operative Credentials...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
