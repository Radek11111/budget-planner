import { db } from "../../../db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middleware/authMiddleware";

export async function deleteSaving(server: FastifyInstance) {
  server.delete(
    "/saving/:id",
    { preHandler: authMiddleware },
    async (request, reply) => {
      if (!request.user) {
        return reply.status(401).send({ error: "Unauthorized" });
      }
      const { id } = request.params as { id: string };
      try {
        const saving = await db.saving.findFirst({
          where: {
            id,
            budget: {
              userId: request.user.id,
            },
          },
          select: {
            id: true,
            amount: true,
            savingGoalId: true,
          },
        });
        if (!saving) {
          return reply.status(404).send({ error: "Saving not found" });
        }
        await db.$transaction(async (tx: any) => {
          await tx.saving.delete({
            where: { id },
          });
          if (saving.savingGoalId) {
            await tx.savingGoal.update({
              where: { id: saving.savingGoalId },
              data: {
                currentAmount: {
                  decrement: saving.amount,
                },
              },
            });
          }
        });
      } catch (error) {
        console.error("Error deleting saving:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
