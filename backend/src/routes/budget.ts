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

  server.post<{ Body: CreateBudget }>(
    "/",
    {
      schema: {
        body: zodToJsonSchema(BudgetSchema),
      },
    },
    async (request, reply) => {
      try {
        const validatedData = BudgetSchema.parse(request.body);
        const {
          userId,
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
}

export default budgetRoutes;
