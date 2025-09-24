"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = adminAuthMiddleware;
const authMiddleware_1 = require("./authMiddleware");
async function adminAuthMiddleware(request, reply) {
    await (0, authMiddleware_1.authMiddleware)(request, reply);
    if (!request.user) {
        return reply.status(403).send({ error: "Forbidden" });
    }
}
