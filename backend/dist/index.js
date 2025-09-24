"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const budget_1 = __importDefault(require("./routes/budget"));
require("fastify");
const sensible_1 = __importDefault(require("@fastify/sensible"));
const admin_1 = __importDefault(require("./routes/admin"));
dotenv_1.default.config();
const server = (0, fastify_1.default)({
    logger: true,
});
server.register(sensible_1.default);
server.register(cors_1.default, {
    origin: process.env.VITE_FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
});
server.register(budget_1.default, { prefix: "/budget" });
server.register(admin_1.default, { prefix: "/admin" });
server.get("/", async () => {
    return { status: "OK" };
});
const start = async () => {
    const port = Number(process.env.PORT || 3001);
    try {
        await server.listen({ port, host: '0.0.0.0' });
    }
    catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};
start();
