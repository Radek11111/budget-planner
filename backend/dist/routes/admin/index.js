"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = adminRoutes;
const getStats_1 = require("./getStats");
const getUsers_1 = require("./getUsers");
const adminAuthMiddleware_1 = require("../../middleware/adminAuthMiddleware");
async function adminRoutes(server) {
    server.addHook("onRequest", adminAuthMiddleware_1.adminAuthMiddleware);
    server.register(getStats_1.getStats);
    server.register(getUsers_1.getUsers);
}
