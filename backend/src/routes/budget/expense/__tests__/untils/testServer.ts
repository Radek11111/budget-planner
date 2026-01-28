import Fastify from "fastify";
import { getExpense } from "../../getExpense";
import { authMiddleware } from "../../../../../middleware/authMiddleware";

export async function buildServer(authOverride?: any) {
  const app = Fastify();

  await app.register(getExpense, {
    authMiddleware: authOverride ?? authMiddleware,
  });
  return app;
}
