"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpense = getExpense;
const db_1 = require("../../../db");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
async function getExpense(server) {
    server.get("/expense", { preHandler: authMiddleware_1.authMiddleware }, async (request, reply) => {
        try {
            if (!request.user) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            const userId = request.user.id;
            const { year, month } = request.query;
            let dataFilter = {};
            if (year && month) {
                const start = new Date(Number(year), Number(month) - 1, 1);
                const end = new Date(Number(year), Number(month), 1);
                dataFilter = {
                    date: {
                        gte: start,
                        lt: end
                    },
                };
            }
            else if (year) {
                const start = new Date(Number(year), 0, 1);
                const end = new Date(Number(year) + 1, 0, 1);
                dataFilter = {
                    date: {
                        gte: start,
                        lt: end,
                    }
                };
            }
            const expenses = await db_1.db.expense.findMany({
                where: { budget: { userId }, ...dataFilter },
                orderBy: { date: "desc" },
                include: {
                    budget: true,
                },
            });
            return reply.status(200).send(expenses);
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
