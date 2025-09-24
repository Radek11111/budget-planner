"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const fastify_1 = require("@clerk/fastify");
const adminOnly = async (fastify) => {
    fastify.addHook("onRequest", async (req) => {
        const { has, userId } = (0, fastify_1.getAuth)(req);
        if (!userId) {
            throw fastify.httpErrors.unauthorized("User ID is required");
        }
        const isAdmin = has({ role: "org:admin" });
        if (!isAdmin) {
            throw fastify.httpErrors.forbidden("User is not an admin");
        }
    });
};
exports.adminOnly = adminOnly;
