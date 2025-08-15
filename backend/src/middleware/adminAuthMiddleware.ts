import { FastifyReply, FastifyRequest } from "fastify";
import { authMiddleware } from "./authMiddleware";

export async function adminAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await authMiddleware(request, reply);
  if (!request.user) {
    return reply.status(403).send({ error: "Forbidden" });
  }
}
