import { db } from "../../../db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middleware/authMiddleware";
import TransactionSchema from "../../../validation/TransactionSchema";

import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export async function addSaving(server: FastifyInstance) {
  server.post<{ Body: z.infer<typeof TransactionSchema> }>(
    "/saving",
    {
      preHandler: authMiddleware,
      schema: { body: zodToJsonSchema(TransactionSchema) },
    },
    async (request, reply) => {
      if (!request.user)
        return reply.status(401).send({ error: "Unauthorized" });
      const userId = request.user.id;

      const { savingGoalId, ...savingData } = request.body;
      const { date, category, description, amount } = savingData;

      const savingDate = new Date(date);

     
      if (savingGoalId) {
        const goal = await db.savingGoal.findFirst({
          where: {
            id: savingGoalId,
            budget: { userId: userId },
          },
        });

        if (!goal) {
          return reply
            .status(404)
            .send({ error: "Cel oszczędnościowy nie znaleziony" });
        }

        await db.savingGoal.update({
          where: { id: savingGoalId },
          data: {
            currentAmount: {
              increment: amount,
            },
          },
        });
      }

      const baseData = {
        date: savingDate,
        category,
        description,
        amount,
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
      };


      const savingDataInput = savingGoalId
        ? {
            ...baseData,
            savingGoal: {
              connect: { id: savingGoalId },
            },
          }
        : baseData;

  
      const saving = await db.saving.create({
        data: savingDataInput,
        include: {
          savingGoal: true,
        },
      });

      return reply.status(201).send(saving);
    }
  );
}
