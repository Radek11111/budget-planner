import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import { db } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
import { z } from "zod";
import TransactionSchema from "../validation/TransactionSchema";

async function budgetRoutes(server: FastifyInstance) {
  console.log("✅ budgetRoutes registered");

  server.get(
    "/",
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      try {
        if (!request.user) {
          return reply.status(401).send({ error: "Unauthorized" });
        }

        const userId = request.user.id;
        const budgets = await db.budget.findMany({
          where: { userId },
        });
        return budgets;
      } catch (error) {
        return reply.status(400).send({ error: "Invalid query parameters" });
      }
    }
  );

  server.post<{ Body: z.infer<typeof TransactionSchema> }>(
    "/incomes",
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
                  // dla wersji z @@unique([userId, name])
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

  server.post<{ Body: z.infer<typeof TransactionSchema> }>(
    "/expense",
    {
      preHandler: authMiddleware,
      schema: { body: zodToJsonSchema(TransactionSchema) },
    },
    async (request, reply) => {
      const userId = request.user?.id;
      if (!userId) return reply.status(401).send({ error: "Unauthorized" });

      const expense = await db.expense.create({
        data: {
          ...request.body,
          budget: {
            connectOrCreate: {
              where: {
                userId_name: {
                  // dla wersji z @@unique([userId, name])
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

      return reply.status(201).send(expense);
    }
  );

  server.post<{ Body: z.infer<typeof TransactionSchema> }>(
    "/saving",
    {
      preHandler: authMiddleware,
      schema: { body: zodToJsonSchema(TransactionSchema) },
    },
    async (request, reply) => {
      const userId = request.user?.id;
      if (!userId) return reply.status(401).send({ error: "Unauthorized" });

      const saving = await db.income.create({
        data: {
          ...request.body,
          budget: {
            connectOrCreate: {
              where: {
                userId_name: {
                  // dla wersji z @@unique([userId, name])
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

      return reply.status(201).send(saving);
    }
  );
  server.delete(
    "/:id",
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const budget = await db.budget.findUnique({
          where: { id },
        });
        if (!budget || budget.userId !== request.user?.id) {
          return reply.status(404).send({ error: "Budget not found" });
        }
        await db.budget.delete({ where: { id } });
        return reply.status(204).send();
      } catch (error) {
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
}

export default budgetRoutes;
