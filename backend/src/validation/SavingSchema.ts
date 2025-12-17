import { date, z } from "zod";

const SavingSchema = z.object({
    date: z.coerce.date(),
    category: z.string().min(1),
    description: z.string(),
    amount: z.number().positive(),
    savingGoalId: z.string().optional(),
})

export default SavingSchema;