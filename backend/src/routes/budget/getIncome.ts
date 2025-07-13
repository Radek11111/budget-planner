import { db } from "db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "middleware/authMiddleware";

export async function getIncome(server: FastifyInstance) {
  server.get(
    "/income",
    { preHandler: authMiddleware },
    async (request, reply) => {
      try {
        if (!request.user) {
          return reply.status(401).send({ error: "Unauthorized" });
        }
        const userId = request.user.id;
        const incomes = await db.income.findMany({
          where: { budget: { userId } },
          orderBy: { date: "desc" },
          include: {
            budget: true,
          },
        });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
