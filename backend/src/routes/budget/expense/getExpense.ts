import { db } from "../../../db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middleware/authMiddleware";

export async function getExpense(server: FastifyInstance) {
  server.get(
    "/expense",
    { preHandler: authMiddleware },
    async (request, reply) => {
      try {
        if (!request.user) {
          return reply.status(401).send({ error: "Unauthorized" });
        }
        const userId = request.user.id;
        const expenses = await db.expense.findMany({
          where: { budget: { userId } },
          orderBy: { date: "desc" },
          include: {
            budget: true,
          },
        });
        return reply.status(200).send(expenses);
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
