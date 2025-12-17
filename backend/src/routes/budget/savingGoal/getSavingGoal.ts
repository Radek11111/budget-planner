import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { db } from "../../../db";

export async function getSavingGoal(server: FastifyInstance) {
  server.get(
    "/saving-goal",
    { preHandler: authMiddleware },
    async (request, reply) => {
      try {
        if (!request.user) {
          return reply.status(401).send({ error: "Unauthorized" });
        }
        const goals = await db.savingGoal.findMany({
          where: { budget: { userId: request.user.id } },
          include: {
            savings: {
              orderBy: { date: "desc" },
              take: 5,
            },
          },
          orderBy: { createdAt: "desc" },
        });
        return reply.status(200).send(goals);
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
