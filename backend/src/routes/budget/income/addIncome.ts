import { db } from "../../db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/authMiddleware";
import TransactionSchema from "../../validation/TransactionSchema";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export async function addIncome(server: FastifyInstance) {
  server.post<{ Body: z.infer<typeof TransactionSchema> }>(
    "/income",
    {
      preHandler: authMiddleware,
      schema: { body: zodToJsonSchema(TransactionSchema) },
    },
    async (request, reply) => {
      const userId = request.user?.id;
      if (!userId) return reply.status(401).send({ error: "Unauthorized" });

      const income = await db.income.create({
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
                userId,
                name: "Default Budget",
                total: 0,
              },
            },
          },
        },
      });

      return reply.status(201).send(income);
    }
  );
}
