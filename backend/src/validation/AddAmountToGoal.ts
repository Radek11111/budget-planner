import { z } from "zod";

const AddAmountToGoalSchema = z.object({
  amount: z.number().positive("Kwota musi być liczbą dodatnią."),
});

export default AddAmountToGoalSchema;
