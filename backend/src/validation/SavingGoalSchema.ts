import { z } from "zod";

const SavingGoalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0).default(0),
  deadline: z.coerce.date().optional(),
});
export default SavingGoalSchema;
