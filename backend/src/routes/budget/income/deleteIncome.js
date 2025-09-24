"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIncome = deleteIncome;
const db_1 = require("../../../db");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
async function deleteIncome(server) {
    server.delete("/income/:id", { preHandler: authMiddleware_1.authMiddleware }, async (request, reply) => {
        const { id } = request.params;
        try {
            await db_1.db.income.delete({
                where: { id: id },
            });
        }
        catch (error) {
            console.error("Error deleting income:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
