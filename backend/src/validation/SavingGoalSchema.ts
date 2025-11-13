import { z } from "zod";

const SavingGoalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  deadline: z.coerce.date().optional(),
});
export default SavingGoalSchema;
