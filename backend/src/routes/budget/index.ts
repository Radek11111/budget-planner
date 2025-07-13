import { FastifyInstance } from "fastify";
import { getBudgets } from "./getBudgets";
import { addExpense } from "./addExpense";
import { addSaving } from "./addSaving";
import { deleteBudget } from "./deleteBudget";
import { addIncome } from "./addIncome";
import { getIncome } from "./getIncome";
import { getExpense } from "./getExpense";
import { getSaving } from "./getSaving";

export default async function budgetRoutes(server: FastifyInstance) {
  server.register(addIncome);
  server.register(addExpense);
  server.register(addSaving);
  server.register(deleteBudget);
  server.register(getBudgets);
  server.register(getIncome);
  server.register(getExpense);
  server.register(getSaving);
}
