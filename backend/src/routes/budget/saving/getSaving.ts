import { db } from "../../../db";
import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middleware/authMiddleware";

export async function getSaving(server: FastifyInstance) {
  server.get(
    "/saving",
    { preHandler: authMiddleware },
    async (request, reply) => {
      if (!request.user) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      try {
        const userId = request.user.id;
        const { year, month } = request.query as {
          year?: string;
          month?: string;
        };

        let dataFilter: any = undefined;

        if (year && month) {
          const start = new Date(Number(year), Number(month) - 1, 1);
          const end = new Date(Number(year), Number(month), 1);
          dataFilter = {
            date: {
              gte: start,
              lt: end,
            },
          };
        } else if (year) {
          const start = new Date(Number(year), 0, 1);
          const end = new Date(Number(year) + 1, 0, 1);
          dataFilter = {
            date: {
              gte: start,
              lt: end,
            },
          };
        }
        const savings = await db.saving.findMany({
          where: {
            budget: { userId },
            ...(dataFilter && { date: dataFilter.date }),
          },

          orderBy: { date: "desc" },
          include: {
            savingGoal: {
              select: {
                id: true,
                name: true,
                targetAmount: true,
                currentAmount: true,
                deadline: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        });
        return reply.status(200).send(savings);
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
