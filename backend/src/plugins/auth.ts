import { FastifyPluginAsync } from "fastify";

import { getAuth } from "@clerk/fastify";

export const adminOnly: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", async (req) => {
    const { has, userId } = getAuth(req);

    if (!userId) {
      throw fastify.httpErrors.unauthorized("User ID is required");
    }

    const isAdmin = has({ role: "org:admin" });
    if (!isAdmin) {
      throw fastify.httpErrors.forbidden("User is not an admin");
    }
  });
};
