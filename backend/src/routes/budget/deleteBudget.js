"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudget = deleteBudget;
const db_1 = require("../../db");
const authMiddleware_1 = require("../../middleware/authMiddleware");
async function deleteBudget(server) {
    server.delete("/:id", {
        preHandler: authMiddleware_1.authMiddleware,
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const budget = await db_1.db.budget.findUnique({
                where: { id },
            });
            if (!budget || budget.userId !== request.user?.id) {
                return reply.status(404).send({ error: "Budget not found" });
            }
            await db_1.db.budget.delete({ where: { id } });
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(500).send({ error: "Internal server error" });
        }
    });
}
