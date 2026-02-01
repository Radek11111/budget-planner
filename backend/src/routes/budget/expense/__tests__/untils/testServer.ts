import Fastify from "fastify";
import { getExpense } from "../../getExpense";
import { authMiddleware } from "../../../../../middleware/authMiddleware";
import { addExpense } from "../../addExpense";

export async function buildServer(authOverride?: any) {
  const app = Fastify();

  const auth = authOverride ?? authMiddleware;

  await app.register(getExpense, {
    authMiddleware: auth,
  });
  await app.register(addExpense, { authMiddleware: auth });
  return app;
}
