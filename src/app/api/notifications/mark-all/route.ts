import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { handleError, unauthorized } from "@/lib/api-utils";

export async function PATCH() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
