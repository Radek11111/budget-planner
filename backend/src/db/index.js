"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const prismaClientSingleton = () => {
    return new client_1.PrismaClient();
};
const db = globalThis.prismaGlobal ?? prismaClientSingleton();
exports.db = db;
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = db;
