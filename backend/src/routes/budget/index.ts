import { FastifyInstance } from "fastify";
import { getBudgets } from "./getBudgets";
import { addExpense } from "./expense/addExpense";
import { addSaving } from ".//saving/addSaving";
import { deleteBudget } from "./deleteBudget";
import { addIncome } from ".//income/addIncome";
import { getIncome } from "./income/getIncome";
import { getExpense } from "./expense/getExpense";
import { getSaving } from "./saving/getSaving";
import { deleteExpense } from "./expense/deleteExpense";
import { deleteSaving } from "./saving/deleteSaving";
import { deleteIncome } from "./income/deleteIncome";

export default async function budgetRoutes(server: FastifyInstance) {
  server.register(addIncome);
  server.register(addExpense);
  server.register(addSaving);
  server.register(deleteBudget);
  server.register(getBudgets);
  server.register(getIncome);
  server.register(getExpense);
  server.register(getSaving);
  server.register(deleteExpense);
  server.register(deleteSaving);
  server.register(deleteIncome);
}
