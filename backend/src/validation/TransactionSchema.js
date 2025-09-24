"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const TransactionSchema = zod_1.z.object({
    date: zod_1.z.coerce.date(),
    category: zod_1.z.string().min(1),
    description: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
});
exports.default = TransactionSchema;
