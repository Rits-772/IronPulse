import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  supabase: typeof supabase;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, options?: any) => Promise<{ data: any, error: any }>;
  signInWithOtp: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string, type: 'email' | 'signup') => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithPassword = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
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
      supabase,
      signOut, 
      signIn: signInWithPassword,
      signInWithPassword,
      signUp,
      signInWithOtp, 
      verifyOtp 
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
