import { FastifyInstance } from "fastify";
import { getBudgetsRoute } from "./getBudgets";
import { addExpense } from "./addExpense";
import { addSaving } from "./addSaving";
import { deleteBudget } from "./deleteBudget";
import { addIncome } from "./addIncome";

export default async function budgetRoutes(server: FastifyInstance) {
  await getBudgetsRoute(server);
  await addIncome(server);
  await addExpense(server);
  await addSaving(server);
  await deleteBudget(server);
}
