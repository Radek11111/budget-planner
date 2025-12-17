import { z } from "zod";
import { BudgetQuerySchema } from "../validation/BudgetQuerySchema";
import TransactionSchema from "../validation/TransactionSchema";

export interface FinancialEntry {
  date: Date;
  category: string;
  description: string;
  amount: number;
}
export interface Budget {
  userId: string;
  name: string;
  total: number;
  incomes?: FinancialEntry[];
  expenses?: FinancialEntry[];
  savings?: FinancialEntry[];
}
export type BudgetQueryParams = z.infer<typeof BudgetQuerySchema>;
export type CreateTransaction = z.infer<typeof TransactionSchema>;
