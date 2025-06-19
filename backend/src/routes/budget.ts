import { FastifyInstance } from "fastify";

async function budgetRoutes(server: FastifyInstance) {
  server.get("/", async (request, reply) => {
    return { message: "Budget API is working!" };
  });

  server.post("/", async (request, reply) => {
    return { message: "Budget data received!" };
  });
}

export default budgetRoutes;
