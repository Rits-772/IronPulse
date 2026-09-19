import { createClient } from '@supabase/supabase-js';

// Purge any dead legacy auth tokens from browser storage before client init
if (typeof window !== 'undefined') {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('jcyqrlqofqtctnllctok') || key.includes('placeholder'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('jcyqrlqofqtctnllctok') || key.includes('placeholder'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(k => sessionStorage.removeItem(k));
  } catch {
    // Ignore storage restrictions
  }
}

const LIVE_SUPABASE_URL = 'https://omtusypuavrivmsiqyka.supabase.co';
const LIVE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdHVzeXB1YXZyaXZtc2lxeWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MzkxMjIsImV4cCI6MjEwNTQxNTEyMn0.DfCVlUL3Qg1ZCTJFt5-pEIHo4mdIUFpDITYC21XFuYc';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Guard against legacy dead project domains or placeholder URLs from old Vercel env configs
const isInvalidUrl = !rawUrl || 
  rawUrl.includes('placeholder') || 
  rawUrl.includes('jcyqrlqofqtctnllctok');

const supabaseUrl = isInvalidUrl ? LIVE_SUPABASE_URL : rawUrl;
const supabaseAnonKey = isInvalidUrl || !rawKey ? LIVE_SUPABASE_ANON_KEY : rawKey;

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
