import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { handleError, unauthorized } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized();

    const range = request.nextUrl.searchParams.get("range") || "1A";
    const now = new Date();
    let months = 12;
    let groupBy: string;

    switch (range) {
      case "7D":
        months = 0;
        groupBy = "day";
        break;
      case "30D":
        months = 1;
        groupBy = "day";
        break;
      case "90D":
        months = 3;
        groupBy = "month";
        break;
      case "1A":
        months = 12;
        groupBy = "month";
        break;
      case "Tudo":
        months = 60;
        groupBy = "month";
        break;
      default:
        months = 12;
        groupBy = "month";
    }

    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - months);
    if (range === "7D") startDate.setDate(startDate.getDate() - 7);
    if (range === "30D") startDate.setDate(startDate.getDate() - 30);

    const startStr = startDate.toISOString().slice(0, 10);

    // Get all transactions in the period to compute running balance
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("amount, type, date")
      .eq("user_id", user.id)
      .gte("date", startStr)
      .is("deleted_at", null)
      .order("date");

    if (error) throw error;

    // Get initial balance from accounts
    const { data: accounts } = await supabase
      .from("accounts")
      .select("balance")
      .eq("user_id", user.id)
      .is("deleted_at", null);

    const initialBalance = accounts?.reduce((s, a) => s + Number(a.balance), 0) || 0;

    // Build time-series
    const series: { name: string; value: number }[] = [];
    let runningBalance = initialBalance;

    if (groupBy === "day") {
      // Daily grouping
      const dailyMap = new Map<string, number>();
      transactions?.forEach((tx) => {
        const d = tx.date;
        const amt = tx.type === "income" ? Number(tx.amount) : -Number(tx.amount);
        dailyMap.set(d, (dailyMap.get(d) || 0) + amt);
      });

      dailyMap.forEach((change, date) => {
        runningBalance += change;
        const d = new Date(date);
        series.push({ name: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }), value: runningBalance });
      });
    } else {
      // Monthly grouping
      const monthlyMap = new Map<string, number>();
      transactions?.forEach((tx) => {
        const key = tx.date.slice(0, 7);
        const amt = tx.type === "income" ? Number(tx.amount) : -Number(tx.amount);
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + amt);
      });

      const sortedMonths = [...monthlyMap.keys()].sort();
      sortedMonths.forEach((key) => {
        runningBalance += monthlyMap.get(key)!;
        const name = new Date(key + "-01").toLocaleDateString("pt-BR", { month: "short" });
        series.push({ name, value: runningBalance });
      });
    }

    // If no data, return mock data
    if (series.length === 0) {
      const mock = [
        { name: "Jan", value: 198000 }, { name: "Fev", value: 203000 }, { name: "Mar", value: 212000 },
        { name: "Abr", value: 218000 }, { name: "Mai", value: 231000 }, { name: "Jun", value: 239000 },
        { name: "Jul", value: 243000 }, { name: "Ago", value: 248500 }, { name: "Set", value: 251000 },
        { name: "Out", value: 250000 }, { name: "Nov", value: 252800 }, { name: "Dez", value: 254120 },
      ];
      return NextResponse.json(mock);
    }

    return NextResponse.json(series);
  } catch (error) {
    return handleError(error);
  }
}
