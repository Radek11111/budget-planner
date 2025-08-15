import { FastifyInstance } from "fastify";
import prisma from "../../lib/prisma";

export async function getStats(server: FastifyInstance) {
  server.get("/stats", async (request, reply) => {
    const totalBudgets = await prisma.budget.count();
    const totalIncomes = await prisma.income.count();
    const totalExpenses = await prisma.expense.count();
    const totalsavings = await prisma.saving.count();
    return {
      totalBudgets,
      totalIncomes,
      totalExpenses,
      totalsavings,
    };
  });
}
