import { createClient } from '@supabase/supabase-js';
import type { Post } from '@/types';

// It's highly recommended to move these to environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://deanexarhorwamaoxjbz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlYW5leGFyaG9yd2FtYW94amJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwODY0MjcsImV4cCI6MjA3MTY2MjQyN30.MxdRI7HZthC_5w-tRO7ipC-1UMclr_g0TJ3ZAzThKlk';

interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post;
        Insert: Partial<Post>;
        Update: Partial<Post>;
      };
    };
  };
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
