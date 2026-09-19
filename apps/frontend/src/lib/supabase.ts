import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://omtusypuavrivmsiqyka.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdHVzeXB1YXZyaXZtc2lxeWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MzkxMjIsImV4cCI6MjEwNTQxNTEyMn0.DfCVlUL3Qg1ZCTJFt5-pEIHo4mdIUFpDITYC21XFuYc';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
