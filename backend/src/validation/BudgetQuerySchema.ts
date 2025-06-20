import { z } from "zod";

export const BudgetQuerySchema = z.object({
  userId: z.string().min(1),
});
