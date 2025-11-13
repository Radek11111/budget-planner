import { z } from "zod";
import SavingGoalSchema from "../../../validation/SavingGoalSchema";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middleware/authMiddleware";
import zodToJsonSchema from "zod-to-json-schema";
import { db } from "../../../db";

export async function addSavingGoal(server: FastifyInstance) {
  server.post<{ Body: z.infer<typeof SavingGoalSchema> }>(
    "/saving-goal",
    {
      preHandler: authMiddleware,
      schema: { body: zodToJsonSchema(SavingGoalSchema) },
    },
    async (request, reply) => {
      if (!request.user)
        return reply.status(401).send({ error: "Unauthorized" });
      const userId = request.user.id;

      const goal = await db.savingGoal.create({
        data: {
          ...request.body,
          budget: {
            connectOrCreate: {
              where: {
                userId_name: {
                  userId: userId,
                  name: "Default Budget",
                },
              },
              create: {
                userId: userId,
                name: "Default Budget",
                total: 0,
              },
            },
          },
        },
      });
      return reply.status(201).send(goal);
    }
  );
}
