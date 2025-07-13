import { db } from "../../../db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middleware/authMiddleware";

export async function deleteExpense(server: FastifyInstance) {
  server.delete(
    "/expense/:id",
    { preHandler: authMiddleware },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      try {
        await db.expense.delete({
          where: { id: id },
        });
      } catch (error) {
        console.error("Error deleting expense:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
