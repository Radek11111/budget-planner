import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../../db", () => ({
  db: {
    expense: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("../../../../middleware/authMiddleware", () => ({
  authMiddleware: async (request: any, reply: any) => {
    request.user = { id: "user-1" };
   
  },
}));

import { db } from "../../../../db";
import { buildServer } from "./untils/testServer";
describe("GET /expense", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("returns expenses for the authenticated user", async () => {
    (db.expense.findMany as any).mockResolvedValueOnce([
      {
        id: "expense-1",
        amount: 100,
        date: new Date("2024-01-01"),
        category: "Food",
        budget: { userId: "user-1" },
      },
    ]);
    const app = await buildServer();
    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/expense",
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body).toHaveLength(1);
    expect(body[0].category).toBe("Food");
  });
});
