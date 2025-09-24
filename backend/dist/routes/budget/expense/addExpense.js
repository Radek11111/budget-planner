"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addExpense = addExpense;
const db_1 = require("../../../db");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const TransactionSchema_1 = __importDefault(require("../../../validation/TransactionSchema"));
const zod_to_json_schema_1 = __importDefault(require("zod-to-json-schema"));
async function addExpense(server) {
    server.post("/expense", {
        preHandler: authMiddleware_1.authMiddleware,
        schema: { body: (0, zod_to_json_schema_1.default)(TransactionSchema_1.default) },
    }, async (request, reply) => {
        if (!request.user)
            return reply.status(401).send({ error: "Unauthorized" });
        const userId = request.user.id;
        const expense = await db_1.db.expense.create({
            data: {
                ...request.body,
                budget: {
                    connectOrCreate: {
                        where: {
                            userId_name: {
                                userId: userId,
                                name: "Default Budget",
                            },
                        },
                        create: {
                            userId: userId,
                            name: "Default Budget",
                            total: 0,
                        },
                    },
                },
            },
        });
        return reply.status(201).send(expense);
    });
}
