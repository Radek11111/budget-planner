import { db } from "db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "middleware/authMiddleware";

export async function deleteIncome(server: FastifyInstance) {
  server.delete(
    "/income/:id",
    { preHandler: authMiddleware },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      try {
        await db.income.delete({
          where: { id: id },
        });
      } catch (error) {
        console.error("Error deleting income:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
