"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSaving = deleteSaving;
const db_1 = require("../../../db");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
async function deleteSaving(server) {
    server.delete("/saving/:id", { preHandler: authMiddleware_1.authMiddleware }, async (request, reply) => {
        const { id } = request.params;
        try {
            await db_1.db.saving.delete({
                where: { id: id },
            });
        }
        catch (error) {
            console.error("Error deleting saving:", error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
