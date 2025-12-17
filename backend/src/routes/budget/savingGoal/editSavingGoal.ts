import { FastifyInstance } from "fastify";
import { z } from "zod";
import { authMiddleware } from "../../../middleware/authMiddleware";
import zodToJsonSchema from "zod-to-json-schema";
import { db } from "../../../db";
import { EditSavingGoalSchema } from "../../../validation/EditSavingGoalSchema";

export function editSavingGoal(server: FastifyInstance) {
  server.patch<{
    Body: z.infer<typeof EditSavingGoalSchema>;
    Params: { id: string };
  }>(
    "/saving-goal/:id",
    {
      preHandler: authMiddleware,
      schema: { body: zodToJsonSchema(EditSavingGoalSchema) },
    },
    async (request, reply) => {
      if (!request.user) {
        return reply.status(401).send({ error: "Unauthorized" });
      }
      try {
        const goal = await db.savingGoal.findFirst({
          where: {
            id: request.params.id,
            budget: { userId: request.user.id },
          },
        });

        if (!goal) {
          return reply.status(404).send({ error: "Saving goal not found" });
        }

        const updatedGoal = await db.savingGoal.update({
          where: { id: request.params.id },
          data: {
            name: request.body.name,
            targetAmount: request.body.targetAmount,
            deadline: request.body.deadline,
          },
          include: {
            savings: {
              orderBy: { date: "desc" },
              take: 5,
            },
          },
        });
        return reply.status(200).send(updatedGoal);
      } catch (error) {
        console.log(error);
        return reply.status(500).send({ error: "Internal server error." });
      }
    }
  );
}
