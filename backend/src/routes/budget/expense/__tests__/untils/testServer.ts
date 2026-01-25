import Fastify from "fastify";
import { getExpense } from "../../getExpense";

export async function buildServer() {
  const app = Fastify();

  await app.register(getExpense);
  return app;
}
