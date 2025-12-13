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

      const { name, targetAmount, currentAmount = 0, deadline } = request.body;

      try {
        const savingGoal = await db.savingGoal.create({
          data: {
            name,
            targetAmount,
            currentAmount,
            deadline,
            budget: {
              connectOrCreate: {
                where: {
                  userId_name: {
                    userId: request.user.id,
                    name: "Default Budget",
                  },
                },
                create: {
                  userId: request.user.id,
                  name: "Default Budget",
                  total: 0,
                },
              },
            },
          },
        });
        return reply.status(201).send(savingGoal);
      } catch (error) {
        console.error("Error creating saving goal:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
