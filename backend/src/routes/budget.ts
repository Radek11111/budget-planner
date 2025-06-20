import { z } from "zod";
import { db } from "../db";
import BudgetSchema from "../validation/BudgetSchema";
import { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BudgetQuerySchema } from "../validation/BudgetQuerySchema";
import { CreateBudget } from "../types";


async function budgetRoutes(server: FastifyInstance) {
  console.log("✅ budgetRoutes registered");

  server.get(
    "/",{
      schema: {
        querystring: zodToJsonSchema(BudgetQuerySchema),
      },
    },
    async (request, reply) => {
      try {
        const { userId } = BudgetQuerySchema.parse(request.query);
        const budgets = await db.budget.findMany({
          where: { userId },
        });
        return budgets;
      } catch (error) {
        return reply.status(400).send({error: "Invalid query parameters"});
        
      }
    }
  )

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
      }
      return reply.status(500).send({ error: "Internal server error" });
    }
  );
}

export default budgetRoutes;
