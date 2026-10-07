// ============================================================================
// AURA — Authentication Context (Supabase Auth & Hackathon Demo Access)
// ============================================================================
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isDemoUser: boolean;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  enableDemoMode: () => void;
}

const DEMO_USER: any = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'commander@aura.ai',
  user_metadata: {
    full_name: 'Lead AI Architect',
    role: 'Principal Evaluator',
  },
};

const AuthContext = createContext<AuthContextType>({
  user: DEMO_USER,
  session: null,
  isDemoUser: true,
  loading: false,
  signInWithEmail: async () => ({ error: null }),
  signOut: async () => {},
  enableDemoMode: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [session, setSession] = useState<Session | null>(null);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        setIsDemoUser(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        setIsDemoUser(false);
      } else {
        // Fall back to demo user so application is always interactive
        setSession(null);
        setUser(DEMO_USER);
        setIsDemoUser(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(DEMO_USER);
    setIsDemoUser(true);
  };

  const enableDemoMode = () => {
    setUser(DEMO_USER);
    setIsDemoUser(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isDemoUser,
        loading,
        signInWithEmail,
        signOut,
        enableDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
