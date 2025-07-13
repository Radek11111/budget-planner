import { db } from "../../db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/authMiddleware";

export async function getBudgets(server: FastifyInstance) {
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
}
