"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const backend_1 = require("@clerk/backend");
const db_1 = require("../db");
const clerkClient = (0, backend_1.createClerkClient)({
    secretKey: process.env.CLERK_SECRET_KEY,
});
async function authMiddleware(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return reply.status(401).send({ error: "Missing authorization header" });
        }
        const token = authHeader.split(" ")[1];
        const session = await (0, backend_1.verifyToken)(token, {
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
        const role = user.publicMetadata?.role || "member";
        await db_1.db.user.upsert({
            where: { id: user.id },
            update: {},
            create: {
                id: user.id,
                email: user.emailAddresses[0]?.emailAddress || "",
                role: String(role),
            },
        });
        request.user = {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress ?? "",
            role: String(role),
        };
    }
    catch (error) {
        console.error("Authentication error:", error);
        return reply.status(401).send({ error: "Unauthorized" });
    }
}
