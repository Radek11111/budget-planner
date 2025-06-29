import { verifyToken, createClerkClient, User } from "@clerk/backend";
import type { FastifyRequest, FastifyReply } from "fastify";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export async function authMiddleware(
  request: FastifyRequest & { user?: User },
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ error: "Missing authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const session = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const userId = session?.sub;
    if (!userId) {
      return reply.status(401).send({ error: "Invalid token" });
    }

    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return reply.status(401).send({ error: "User not found" });
    }

    request.user = user;
  } catch (error) {
    console.error("Authentication error:", error);
    return reply.status(401).send({ error: "Unauthorized" });
  }
}


