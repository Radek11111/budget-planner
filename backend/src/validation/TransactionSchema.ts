import { z } from "zod";

const TransactionSchema = z.object({
  date: z.coerce.date(),
  category: z.string().min(1),
  description: z.string(),
  amount: z.number().positive(),
});
export default TransactionSchema;
