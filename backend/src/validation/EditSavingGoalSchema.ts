import { z } from "zod";

export const EditSavingGoalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  deadline: z.string().optional(),
});
