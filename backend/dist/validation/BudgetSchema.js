"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const BudgetSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    total: zod_1.z.number().positive(),
    incomes: zod_1.z
        .array(zod_1.z.object({
        date: zod_1.z.coerce.date(),
        category: zod_1.z.string().min(1),
        description: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
    }))
        .optional(),
    expenses: zod_1.z
        .array(zod_1.z.object({
        date: zod_1.z.coerce.date(),
        category: zod_1.z.string().min(1),
        description: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
    }))
        .optional(),
    savings: zod_1.z
        .array(zod_1.z.object({
        date: zod_1.z.coerce.date(),
        category: zod_1.z.string().min(1),
        description: zod_1.z.string(),
        amount: zod_1.z.number().positive(),
    }))
        .optional(),
});
exports.default = BudgetSchema;
