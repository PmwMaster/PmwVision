import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { handleError, unauthorized } from "@/lib/api-utils";
import { transactionSchema } from "@/lib/validations";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*, category:categories(name), account:accounts(name)")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("date", { ascending: false })
      .limit(100);

    if (error) throw error;
    return NextResponse.json(transactions);
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
    const parsed = transactionSchema.parse(body);
    const { data, error } = await supabase
      .from("transactions")
      .insert({ ...parsed, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
