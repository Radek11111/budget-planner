"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetQuerySchema = void 0;
const zod_1 = require("zod");
exports.BudgetQuerySchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
});
