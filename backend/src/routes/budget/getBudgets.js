"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgets = getBudgets;
const db_1 = require("../../db");
const authMiddleware_1 = require("../../middleware/authMiddleware");
async function getBudgets(server) {
    server.get("/", {
        preHandler: authMiddleware_1.authMiddleware,
    }, async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const userId = request.user.id;
            const budgets = await db_1.db.budget.findMany({
                where: { userId },
            });
            return reply.status(200).send(budgets);
        }
        catch (error) {
            return reply.status(400).send({ error: "Invalid query parameters" });
        }
    });
}
