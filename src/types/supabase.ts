export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          balance: number;
          type: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          balance?: number;
          type: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          balance?: number;
          type?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: "income" | "expense" | "investment" | "reinvestment";
          color: string | null;
          icon: string | null;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: "income" | "expense" | "investment" | "reinvestment";
          color?: string | null;
          icon?: string | null;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: "income" | "expense" | "investment" | "reinvestment";
          color?: string | null;
          icon?: string | null;
          created_at?: string;
          deleted_at?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string | null;
          category_id: string | null;
          type: "income" | "expense" | "transfer";
          amount: number;
          description: string;
          date: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id?: string | null;
          category_id?: string | null;
          type: "income" | "expense" | "transfer";
          amount: number;
          description: string;
          date: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string | null;
          category_id?: string | null;
          type?: "income" | "expense" | "transfer";
          amount?: number;
          description?: string;
          date?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      investments: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          amount: number;
          current_value: number | null;
          profitability: number | null;
          date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: string;
          amount: number;
          current_value?: number | null;
          profitability?: number | null;
          date: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: string;
          amount?: number;
          current_value?: number | null;
          profitability?: number | null;
          date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      betting_investments: {
        Row: {
          id: string;
          user_id: string;
          initial_bank: number;
          current_bank: number;
          deposits: number;
          withdrawals: number;
          profit: number;
          roi: number;
          date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          initial_bank: number;
          current_bank?: number;
          deposits?: number;
          withdrawals?: number;
          profit?: number;
          roi?: number;
          date: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          initial_bank?: number;
          current_bank?: number;
          deposits?: number;
          withdrawals?: number;
          profit?: number;
          roi?: number;
          date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      hobby_investments: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          amount: number;
          current_value: number | null;
          date: string;
          notes: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          amount: number;
          current_value?: number | null;
          date: string;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          category?: string;
          amount?: number;
          current_value?: number | null;
          date?: string;
          notes?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      reinvestments: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          source: string;
          category_id: string | null;
          date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          source: string;
          category_id?: string | null;
          date: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          source?: string;
          category_id?: string | null;
          date?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          category: string;
          deadline: string;
          priority: "low" | "medium" | "high";
          description: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          category: string;
          deadline: string;
          priority?: "low" | "medium" | "high";
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_amount?: number;
          current_amount?: number;
          category?: string;
          deadline?: string;
          priority?: "low" | "medium" | "high";
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      goal_images: {
        Row: {
          id: string;
          goal_id: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          goal_id: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          goal_id?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          read?: boolean;
          created_at?: string;
        };
      };
      monthly_budgets: {
        Row: {
          id: string;
          user_id: string;
          month: string;
          limit_amount: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          month: string;
          limit_amount: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          month?: string;
          limit_amount?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Account = Database["public"]["Tables"]["accounts"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type Investment = Database["public"]["Tables"]["investments"]["Row"];
export type BettingInvestment = Database["public"]["Tables"]["betting_investments"]["Row"];
export type HobbyInvestment = Database["public"]["Tables"]["hobby_investments"]["Row"];
export type Reinvestment = Database["public"]["Tables"]["reinvestments"]["Row"];
export type Goal = Database["public"]["Tables"]["goals"]["Row"];
export type GoalImage = Database["public"]["Tables"]["goal_images"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type MonthlyBudget = Database["public"]["Tables"]["monthly_budgets"]["Row"];
