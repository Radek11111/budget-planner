"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = getStats;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function getStats(server) {
    server.get("/stats", async (request, reply) => {
        const totalBudgets = await prisma_1.default.budget.count();
        const totalIncomes = await prisma_1.default.income.count();
        const totalExpenses = await prisma_1.default.expense.count();
        const totalsavings = await prisma_1.default.saving.count();
        return {
            totalBudgets,
            totalIncomes,
            totalExpenses,
            totalsavings,
        };
    });
}
