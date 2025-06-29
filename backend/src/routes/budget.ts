import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import { db } from "../db";
import BudgetSchema from "../validation/BudgetSchema";
import { CreateBudget } from "../types/types";
import { authMiddleware } from "../middleware/authMiddleware";
import { z } from "zod";

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

  server.post<{ Body: Omit<CreateBudget, "userId"> }>(
    "/",
    {
      preHandler: authMiddleware,
      schema: {
        body: zodToJsonSchema(BudgetSchema.omit({ userId: true })),
      },
    },
    async (request, reply) => {
      try {
        const userId = request.user?.id;
        if (!userId) {
          return reply.status(401).send({ error: "Unauthorized" });
        }
        const validatedData = BudgetSchema.omit({ userId: true }).parse(
          request.body
        );
        const {
          name,
          total,
          incomes = [],
          expenses = [],
          savings = [],
        } = validatedData;
        const newBudget = await db.budget.create({
          data: {
            userId,
            name,
            total,
            incomes: {
              create: incomes,
            },
            expenses: {
              create: expenses,
            },
            savings: {
              create: savings,
            },
          },
        });
        return reply.status(201).send(newBudget);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            error: "validation error",
            details: error.errors || "Invalid budget data",
          });
        }
        return reply.status(500).send({ error: "Internal server error" });
      }
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
