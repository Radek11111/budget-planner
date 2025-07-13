import { db } from "db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "middleware/authMiddleware";

export async function deleteSaving(server: FastifyInstance) {
  server.delete(
    "/saving/:id",
    { preHandler: authMiddleware },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      try {
        await db.saving.delete({
          where: { id: id },
        });
      } catch (error) {
        console.error("Error deleting saving:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
