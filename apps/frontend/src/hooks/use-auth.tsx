import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Default Operative User for seamless instant access
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
  access_token: 'mock-access-token',
  token_type: 'bearer',
  expires_in: 3600 * 24 * 365,
  refresh_token: 'mock-refresh-token',
  user: DEMO_USER,
};

type AuthContextType = {
  user: User;
  session: Session | null;
  loading: boolean;
  isBypassMode: boolean;
  supabase: typeof supabase;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, options?: any) => Promise<{ data: any; error: any }>;
  signInWithOtp: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string, type: 'email' | 'signup') => Promise<{ error: any }>;
  enableBypass: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(DEMO_USER);
  const [session, setSession] = useState<Session | null>(DEMO_SESSION);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to get real session from Supabase if active
    supabase.auth.getSession().then(({ data: { session: realSession } }) => {
      if (realSession && realSession.user) {
        setSession(realSession);
        setUser(realSession.user);
      }
    }).catch(() => {
      // fallback to DEMO_USER
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession && newSession.user) {
        setSession(newSession);
        setUser(newSession.user);
      } else {
        setSession(DEMO_SESSION);
        setUser(DEMO_USER);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    setUser(DEMO_USER);
    setSession(DEMO_SESSION);
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  };

  const enableBypass = () => {
    setUser(DEMO_USER);
    setSession(DEMO_SESSION);
  };

  const signInWithPassword = async (email: string, password: string) => {
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (!res.error && res.data.session) {
      setSession(res.data.session);
      setUser(res.data.session.user);
    }
    return res;
  };

  const signUp = async (email: string, password: string, options?: any) => {
    return await supabase.auth.signUp({ email, password, options });
  };

  const signInWithOtp = async (email: string) => {
    return await supabase.auth.signInWithOtp({ email });
  };

  const verifyOtp = async (email: string, token: string, type: 'email' | 'signup' = 'email') => {
    return await supabase.auth.verifyOtp({ email, token, type });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      isBypassMode: true,
      supabase,
      signOut, 
      signIn: signInWithPassword,
      signInWithPassword,
      signUp,
      signInWithOtp, 
      verifyOtp,
      enableBypass,
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
