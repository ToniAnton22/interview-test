import { cookies } from "next/headers";
import { createClient } from "./server";

export async function validateUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, user: null, supabase };
  }
  return { success: true, user, supabase };
}
