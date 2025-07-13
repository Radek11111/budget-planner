import { FastifyInstance } from "fastify";
import { getBudgetsRoute } from "./getBudgets";
import { addExpense } from "./addExpense";
import { addSaving } from "./addSaving";
import { deleteBudget } from "./deleteBudget";
import { addIncome } from "./addIncome";

export default async function budgetRoutes(server: FastifyInstance) {
  server.register(addIncome);
  server.register(addExpense);
  server.register(addSaving);
  server.register(deleteBudget);
  server.register(getBudgetsRoute);
}
