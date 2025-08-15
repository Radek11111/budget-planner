import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import budgetRoutes from "./routes/budget";
import "fastify";

import sensible from "@fastify/sensible";
import adminRoutes from "./routes/admin";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role: string;
    };
  }
}

dotenv.config();

const server = Fastify({
  logger: true,
});

server.register(sensible);

server.register(cors, {
  origin: process.env.VITE_FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});
server.register(budgetRoutes, { prefix: "/budget" });
server.register(adminRoutes, { prefix: "/admin" });

server.get("/", async () => {
  return { status: "OK" };
});

const start = async () => {
  try {
    await server.listen({ port: 3001 });
    console.log(`Server running on http://localhost:3001`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
