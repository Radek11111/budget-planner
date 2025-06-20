import { z } from "zod";

const BudgetSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  total: z.number().positive(),
  incomes: z
    .array(
      z.object({
        date: z.coerce.date(),
        category: z.string().min(1),
        description: z.string(),
        amount: z.number().positive(),
      })
    )
    .optional(),
  expenses: z
    .array(
      z.object({
        date: z.coerce.date(),
        category: z.string().min(1),
        description: z.string(),
        amount: z.number().positive(),
      })
    )
    .optional(),
  savings: z
    .array(
      z.object({
        date: z.coerce.date(),
        category: z.string().min(1),
        description: z.string(),
        amount: z.number().positive(),
      })
    )
    .optional(),
});

export default BudgetSchema;
