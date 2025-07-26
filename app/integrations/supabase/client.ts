import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';

const SUPABASE_URL = 'https://zaqrpimlzzgzokhtitbj.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcXJwaW1senpnem9raHRpdGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjAzNjksImV4cCI6MjA2NzI5NjM2OX0.n7hXvsSwQzVsWwTyLq6yTaD0pOJLVuGgE5gLciwuTvc';

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);