"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function getUsers(server) {
    server.get("/users", async (request, reply) => {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                budgets: {
                    select: {
                        id: true,
                        name: true,
                        total: true,
                        createdAt: true,
                    },
                },
            },
        });
        return users;
    });
}
