import { db } from "../../db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/authMiddleware";

export async function deleteBudget(server: FastifyInstance) {
  server.delete(
    "/:id",
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const budget = await db.budget.findUnique({
          where: { id },
        });
        if (!budget || budget.userId !== request.user?.id) {
          return reply.status(404).send({ error: "Budget not found" });
        }
        await db.budget.delete({ where: { id } });
        return reply.status(204).send();
      } catch (error) {
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
}
