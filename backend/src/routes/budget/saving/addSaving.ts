import { db } from "../../../db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import SavingSchema from "../../../validation/SavingSchema";

export async function addSaving(server: FastifyInstance) {
  server.post<{ Body: z.infer<typeof SavingSchema> }>(
    "/saving",
    {
      preHandler: authMiddleware,
      schema: { body: zodToJsonSchema(SavingSchema) },
    },
    async (request, reply) => {
      if (!request.user)
        return reply.status(401).send({ error: "Unauthorized" });

      const { date, amount, description, category, savingGoalId } =
        request.body;

      try {
        if (savingGoalId) {
          const goal = await db.savingGoal.findFirst({
            where: { id: savingGoalId, budget: { userId: request.user.id } },
          });
          if (!goal) {
            return reply.status(400).send({ error: "Invalid savingGoalId" });
          }
        }
        const saving = await db.saving.create({
          data: {
            date,
            amount,
            description,
            category,

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
            ...(savingGoalId && {
              savingGoal: { connect: { id: savingGoalId } },
            }),
          },
        });

        return reply.status(201).send(saving);
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
