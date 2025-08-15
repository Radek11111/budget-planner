import { FastifyInstance } from "fastify";
import prisma from "../../lib/prisma";

export async function getUsers(server: FastifyInstance) {
  server.get("/users", async (request, reply) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        budgets: {
          select: {
            id: true,
            name: true,
            total: true,
            createdAt: true,
          },
        },
      },
    });
    return users;
  });
}
