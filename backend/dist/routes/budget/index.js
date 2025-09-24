"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = budgetRoutes;
const getBudgets_1 = require("./getBudgets");
const addExpense_1 = require("./expense/addExpense");
const addSaving_1 = require(".//saving/addSaving");
const deleteBudget_1 = require("./deleteBudget");
const addIncome_1 = require(".//income/addIncome");
const getIncome_1 = require("./income/getIncome");
const getExpense_1 = require("./expense/getExpense");
const getSaving_1 = require("./saving/getSaving");
const deleteExpense_1 = require("./expense/deleteExpense");
const deleteSaving_1 = require("./saving/deleteSaving");
const deleteIncome_1 = require("./income/deleteIncome");
async function budgetRoutes(server) {
    server.register(addIncome_1.addIncome);
    server.register(addExpense_1.addExpense);
    server.register(addSaving_1.addSaving);
    server.register(deleteBudget_1.deleteBudget);
    server.register(getBudgets_1.getBudgets);
    server.register(getIncome_1.getIncome);
    server.register(getExpense_1.getExpense);
    server.register(getSaving_1.getSaving);
    server.register(deleteExpense_1.deleteExpense);
    server.register(deleteSaving_1.deleteSaving);
    server.register(deleteIncome_1.deleteIncome);
}
