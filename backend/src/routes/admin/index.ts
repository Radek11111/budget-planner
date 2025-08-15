import { FastifyInstance } from "fastify";
import { getStats } from "./getStats";
import { getUsers } from "./getUsers";
import { adminAuthMiddleware } from "../../middleware/adminAuthMiddleware";

export default async function adminRoutes(server: FastifyInstance) {
  server.addHook("onRequest", adminAuthMiddleware);
  server.register(getStats);
  server.register(getUsers);
}
