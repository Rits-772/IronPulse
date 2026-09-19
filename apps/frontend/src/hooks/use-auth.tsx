import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

// Default Demo Operative User for optional one-click sandbox testing
export const DEMO_USER: User = {
  id: '00000000-0000-0000-0000-000000000001',
  app_metadata: { provider: 'email' },
  user_metadata: {
    username: 'NEXUS_OPERATIVE',
    full_name: 'Alex Vance',
    avatar_url: '',
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'operative@ironpulse.io',
  phone: '',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

export const DEMO_SESSION: Session = {
  access_token: 'demo-access-token',
  token_type: 'bearer',
  expires_in: 3600 * 24 * 365,
  refresh_token: 'demo-refresh-token',
  user: DEMO_USER,
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isDemoMode: boolean;
  supabase: typeof supabase;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, options?: any) => Promise<{ data: any; error: AuthError | null }>;
  signInAsDemo: () => void;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Check if demo mode was explicitly active in this browser session
    const isDemo = localStorage.getItem('ironpulse_demo_auth') === 'true';
    if (isDemo) {
      if (isMounted) {
        setUser(DEMO_USER);
        setSession(DEMO_SESSION);
        setIsDemoMode(true);
        setLoading(false);
      }
      return;
    }

    // 2. Fetch live Supabase session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      if (!error && initialSession && initialSession.user) {
        setSession(initialSession);
        setUser(initialSession.user);
        setIsDemoMode(false);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    }).catch(() => {
      if (isMounted) {
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    });

    // 3. Listen to auth state changes in real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      if (newSession && newSession.user) {
        setSession(newSession);
        setUser(newSession.user);
        setIsDemoMode(false);
        localStorage.removeItem('ironpulse_demo_auth');
      } else if (!isDemoMode) {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isDemoMode]);

  const signInWithPassword = async (email: string, password: string) => {
    setLoading(true);
    localStorage.removeItem('ironpulse_demo_auth');
    setIsDemoMode(false);
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (!res.error && res.data.session) {
      setSession(res.data.session);
      setUser(res.data.session.user);
    }
    setLoading(false);
    return { error: res.error };
  };

  const signUp = async (email: string, password: string, options?: any) => {
    setLoading(true);
    localStorage.removeItem('ironpulse_demo_auth');
    setIsDemoMode(false);
    const res = await supabase.auth.signUp({ email, password, options });
    if (!res.error && res.data.session) {
      setSession(res.data.session);
      setUser(res.data.session.user);
    }
    setLoading(false);
    return res;
  };

  const signInAsDemo = () => {
    localStorage.setItem('ironpulse_demo_auth', 'true');
    setUser(DEMO_USER);
    setSession(DEMO_SESSION);
    setIsDemoMode(true);
    setLoading(false);
  };

  const signOut = async () => {
    localStorage.removeItem('ironpulse_demo_auth');
    setUser(null);
    setSession(null);
    setIsDemoMode(false);
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  };

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/settings`
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isDemoMode,
      supabase,
      signOut, 
      signIn: signInWithPassword,
      signInWithPassword,
      signUp,
      signInAsDemo,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
