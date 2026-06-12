export { createBrowserClient } from "./supabase/client";

import { createBrowserClient } from "./supabase/client";

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_, prop) {
    if (!supabaseInstance) {
      supabaseInstance = createBrowserClient();
    }
    return supabaseInstance[prop as keyof typeof supabaseInstance];
  },
});
