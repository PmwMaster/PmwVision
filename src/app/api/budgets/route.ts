import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { handleError, unauthorized } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const month = request.nextUrl.searchParams.get("month") ||
      new Date().toISOString().slice(0, 7);

    const { data, error } = await supabase
      .from("monthly_budgets")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .is("deleted_at", null)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return NextResponse.json(data || null);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const body = await request.json();
    const { data, error } = await supabase
      .from("monthly_budgets")
      .upsert({ ...body, user_id: user.id }, { onConflict: "user_id,month" })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
