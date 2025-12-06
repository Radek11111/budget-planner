import { FastifyInstance } from "fastify";
import AddAmountToGoalSchema from "../../../validation/AddAmountToGoal";
import { z } from "zod";
import { authMiddleware } from "../../../middleware/authMiddleware";
import zodToJsonSchema from "zod-to-json-schema";
import { db } from "../../../db";

export async function addAmountToGoal(server: FastifyInstance) {
  server.patch<{
    Params: { id: string };
    Body: z.infer<typeof AddAmountToGoalSchema>;
  }>(
    "/saving-goal/:id/add-amount",
    {
      preHandler: authMiddleware,
      schema: {
        params: z.object({ id: z.string() }),
        body: zodToJsonSchema(AddAmountToGoalSchema),
      },
    },
    async (request, reply) => {
      if (!request.user)
        return reply.status(401).send({ error: "Unauthorized" });

      const { id } = request.params;
      const { amount } = request.body;

      try {
        const goal = await db.savingGoal.findFirst({
          where: {
            id: id,
            budget: { userId: request.user.id },
          },
        });

        if (!goal) {
          return reply
            .status(404)
            .send({ error: "Cel oszczędnościowy nie znaleziony" });
        }

        const updatedGoal = await db.savingGoal.update({
          where: { id: id },
          data: {
            currentAmount: {
              increment: amount,
            },
          },
          include: {
            savings: true,
          },
        });

        return reply.status(200).send(updatedGoal);
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
