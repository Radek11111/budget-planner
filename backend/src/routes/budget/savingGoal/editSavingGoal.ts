import { FastifyInstance } from "fastify";
import SavingGoalSchema from "../../../validation/SavingGoalSchema";
import { z } from "zod";
import { authMiddleware } from "../../../middleware/authMiddleware";
import zodToJsonSchema from "zod-to-json-schema";
import { db } from "../../../db";

export function editSavingGoal(server: FastifyInstance) {
  server.patch<{
    Body: z.infer<typeof SavingGoalSchema>;
    Params: { id: string };
  }>(
    "/saving-goal/:id",
    {
      preHandler: authMiddleware,
      schema: { body: zodToJsonSchema(SavingGoalSchema) },
    },
    async (request, reply) => {
      try {
        const updatedGoal = await db.savingGoal.update({
          where: { id: request.params.id },
          data: { ...request.body },
        });
        return reply.status(200).send(updatedGoal);
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: 'Internal server error.'})
      }
    }
  );
}
