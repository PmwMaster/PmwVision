import { z } from "zod";

// ============================================
// Transactions
// ============================================
export const transactionSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.coerce.number().min(0.01, "Valor mínimo: R$ 0,01"),
  category: z.string().min(1, "Categoria é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  account_id: z.string().uuid().optional(),
  category_id: z.string().uuid().optional(),
});

export const transactionUpdateSchema = transactionSchema.partial();

// ============================================
// Investments
// ============================================
export const investmentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  amount: z.coerce.number().min(0.01, "Valor mínimo: R$ 0,01"),
  current_value: z.coerce.number().optional(),
  profitability: z.coerce.number().optional(),
  date: z.string().min(1, "Data é obrigatória"),
  notes: z.string().optional(),
});

export const investmentUpdateSchema = investmentSchema.partial();

// ============================================
// Goals
// ============================================
export const goalSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  target_amount: z.coerce.number().min(0.01, "Valor mínimo: R$ 0,01"),
  current_amount: z.coerce.number().min(0).default(0),
  category: z.string().min(1, "Categoria é obrigatória"),
  deadline: z.string().min(1, "Data é obrigatória"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  description: z.string().optional(),
});

export const goalUpdateSchema = goalSchema.partial();

// ============================================
// Reinvestments
// ============================================
export const reinvestmentSchema = z.object({
  amount: z.coerce.number().min(0.01, "Valor mínimo: R$ 0,01"),
  source: z.string().min(1, "Origem é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  notes: z.string().optional(),
  category_id: z.string().uuid().optional(),
});

export const reinvestmentUpdateSchema = reinvestmentSchema.partial();

// ============================================
// Budgets
// ============================================
export const budgetSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Formato: YYYY-MM"),
  limit_amount: z.coerce.number().min(0.01, "Valor mínimo: R$ 0,01"),
});

// ============================================
// Categories
// ============================================
export const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["income", "expense", "investment", "reinvestment"]),
  color: z.string().optional(),
  icon: z.string().optional(),
});

// ============================================
// Profile
// ============================================
export const profileSchema = z.object({
  full_name: z.string().min(1, "Nome é obrigatório"),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

// ============================================
// Accounts
// ============================================
export const accountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["checking", "savings", "investment", "wallet", "other"]),
  balance: z.coerce.number().min(0).default(0),
});

export const accountUpdateSchema = accountSchema.partial();

// ============================================
// Betting Investments
// ============================================
export const bettingInvestmentSchema = z.object({
  initial_bank: z.coerce.number().min(0, "Valor mínimo: R$ 0,00"),
  current_bank: z.coerce.number().min(0).default(0),
  deposits: z.coerce.number().min(0).default(0),
  withdrawals: z.coerce.number().min(0).default(0),
  profit: z.coerce.number().default(0),
  roi: z.coerce.number().default(0),
  date: z.string().min(1, "Data é obrigatória"),
  notes: z.string().optional(),
});

export const bettingInvestmentUpdateSchema = bettingInvestmentSchema.partial();

// ============================================
// Hobby Investments
// ============================================
export const hobbyInvestmentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  amount: z.coerce.number().min(0.01, "Valor mínimo: R$ 0,01"),
  current_value: z.coerce.number().optional(),
  date: z.string().min(1, "Data é obrigatória"),
  notes: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
});

export const hobbyInvestmentUpdateSchema = hobbyInvestmentSchema.partial();
