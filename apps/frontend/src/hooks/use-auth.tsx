import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  supabase: typeof supabase;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, options?: any) => Promise<{ data: any; error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Purge any legacy demo auth keys
    localStorage.removeItem('ironpulse_demo_auth');

    // 1. Fetch live Supabase session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      if (!error && initialSession && initialSession.user) {
        setSession(initialSession);
        setUser(initialSession.user);
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

    // 2. Listen to auth state changes in real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      if (newSession && newSession.user) {
        setSession(newSession);
        setUser(newSession.user);
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      if (!res.error && res.data.session) {
        setSession(res.data.session);
        setUser(res.data.session.user);
      }
      setLoading(false);
      return { error: res.error };
    } catch (err: any) {
      setLoading(false);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, options?: any) => {
    setLoading(true);
    try {
      const res = await supabase.auth.signUp({ 
        email: email.trim(), 
        password, 
        options 
      });
      if (!res.error && res.data.session) {
        setSession(res.data.session);
        setUser(res.data.session.user);
      }
      setLoading(false);
      return res;
    } catch (err: any) {
      setLoading(false);
      return { data: { user: null, session: null }, error: err };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  };

  const resetPassword = async (email: string) => {
    try {
      return await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/settings`
      });
    } catch (err: any) {
      return { data: null, error: err };
    }
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
