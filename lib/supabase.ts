import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// IMPORTANT: this must be createBrowserClient from "@supabase/ssr",
// not createClient from "@supabase/supabase-js". The plain
// supabase-js client only keeps your login in the browser's
// localStorage, which the server (API routes, server components)
// can never see. createBrowserClient also writes the session into a
// cookie, so server-side code (lib/supabase-server.ts) can tell who
// is logged in. Without this, every server-side "is this user
// logged in?" check fails even right after a successful login.
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);
