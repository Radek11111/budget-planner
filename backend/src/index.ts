import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import budgetRoutes from "./routes/budget";


dotenv.config();

const server = Fastify();

server.register(cors);
server.register(budgetRoutes, { prefix: "/budget" });

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
