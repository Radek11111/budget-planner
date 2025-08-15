import { db } from "../../../db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middleware/authMiddleware";
import TransactionSchema from "../../../validation/TransactionSchema";

import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export async function addExpense(server: FastifyInstance) {
  server.post<{ Body: z.infer<typeof TransactionSchema> }>(
    "/expense",
    {
      preHandler: authMiddleware,
      schema: { body: zodToJsonSchema(TransactionSchema) },
    },
    async (request, reply) => {
      if (!request.user) return reply.status(401).send({ error: "Unauthorized" });
      const userId = request.user.id;

      const expense = await db.expense.create({
        data: {
          ...request.body,
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
      return reply.status(201).send(expense);
    }
  );
}
