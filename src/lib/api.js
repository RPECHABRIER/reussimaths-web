import { supabase } from "./supabaseClient";

export async function authenticatedFetch(url, options = {}) {
  const { data, error } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (error || !token) throw new Error("Ta session a expiré. Reconnecte-toi puis réessaie.");

  const headers = new Headers(options.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(url, { ...options, headers });
}
