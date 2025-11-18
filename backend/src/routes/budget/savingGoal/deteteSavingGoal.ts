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
        if (!request.user) {
          return reply.status(401).send({ error: "Unauthorized" });
        }

        
        const existingGoal = await db.savingGoal.findFirst({
          where: {
            id: id,
            budget: { userId: request.user.id },
          },
        });

        if (!existingGoal) {
          return reply.status(404).send({ error: "Saving goal not found" });
        }

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
