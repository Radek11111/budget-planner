import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { db } from "../../../db";

export async function deleteSavingGoal(server: FastifyInstance) {
  server.delete(
    "/saving-goal/:id",
    { preHandler: authMiddleware },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      try {
        await db.savingGoal.delete({
          where: { id: id },
        });
        reply.status(204).send();
      } catch (error) {
        console.error("Error deleting expense:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
