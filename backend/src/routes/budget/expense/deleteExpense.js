"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = deleteExpense;
const db_1 = require("../../../db");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
async function deleteExpense(server) {
    server.delete("/expense/:id", { preHandler: authMiddleware_1.authMiddleware }, async (request, reply) => {
        const { id } = request.params;
        try {
            await db_1.db.expense.delete({
                where: { id: id },
            });
        }
        catch (error) {
            console.error("Error deleting expense:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
