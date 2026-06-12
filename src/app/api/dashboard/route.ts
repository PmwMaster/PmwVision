import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { handleError, unauthorized } from "@/lib/api-utils";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

    // Get monthly income
    const { data: incomeData } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", user.id)
      .eq("type", "income")
      .gte("date", monthStart)
      .is("deleted_at", null);

    // Get monthly expenses
    const { data: expenseData } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", user.id)
      .eq("type", "expense")
      .gte("date", monthStart)
      .is("deleted_at", null);

    // Get total invested
    const { data: investedData } = await supabase
      .from("investments")
      .select("amount")
      .eq("user_id", user.id)
      .is("deleted_at", null);

    // Get total reinvested
    const { data: reinvestedData } = await supabase
      .from("reinvestments")
      .select("amount")
      .eq("user_id", user.id)
      .is("deleted_at", null);

    // Get active goals count
    const { count: activeGoals } = await supabase
      .from("goals")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("deleted_at", null);

    // Get total wealth (accounts balance)
    const { data: accounts } = await supabase
      .from("accounts")
      .select("balance")
      .eq("user_id", user.id)
      .is("deleted_at", null);

    const monthlyIncome = incomeData?.reduce((s, t) => s + Number(t.amount), 0) || 0;
    const monthlyExpense = expenseData?.reduce((s, t) => s + Number(t.amount), 0) || 0;
    const totalInvested = investedData?.reduce((s, t) => s + Number(t.amount), 0) || 0;
    const totalReinvested = reinvestedData?.reduce((s, t) => s + Number(t.amount), 0) || 0;
    const totalBalance = accounts?.reduce((s, a) => s + Number(a.balance), 0) || 0;
    const netProfit = monthlyIncome - monthlyExpense;

    return NextResponse.json({
      balance: totalBalance,
      monthlyIncome,
      monthlyExpense,
      netProfit,
      totalInvested,
      totalReinvested,
      totalWealth: totalBalance + totalInvested,
      activeGoals: activeGoals || 0,
    });
  } catch (error) {
    return handleError(error);
  }
}
