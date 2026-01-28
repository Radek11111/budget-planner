import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../../db", () => ({
  db: {
    expense: {
      findMany: vi.fn(),
    },
  },
}));

import { db } from "../../../../db";
import { buildServer } from "./untils/testServer";
describe("GET /expense", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("returns expenses for the authenticated user", async () => {
    const authMock = async (req: any) => {
      req.user = { id: "user-1" };
    };

    (db.expense.findMany as any).mockResolvedValueOnce([
      {
        id: "expense-1",
        amount: 100,
        date: new Date("2024-01-01"),
        category: "Food",
        budget: { userId: "user-1" },
      },
    ]);
    const app = await buildServer(authMock);
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

  it("returns 401 if user is not authenticated", async () => {
    const authMock = async () => {};
    const app = await buildServer(authMock);
    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/expense",
    });
    expect(response.statusCode).toBe(401);
  });

  it("returns 500 on db throw error", async () => {
    const authMock = async (req: any) => {
      req.user = { id: "user-1" };
    };
    (db.expense.findMany as any).mockResolvedValueOnce(new Error("DB Error"));

    const app = await buildServer(authMock);
    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/expense",
    });
    expect(response.statusCode).toBe(500);
  });

  it("filters expenses by year and month", async () => {
      const authMock = async (req: any) => {
        req.user = { id: "user-1" };
      };

    (db.expense.findMany as any).mockResolvedValueOnce([]);

    const app = await buildServer(authMock);

    await app.inject({
      method: "GET",
      url: "/expense?year=2025&month=1",
    });

    expect(db.expense.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          date: {
            gte: new Date(2025, 0, 1),
            lt: new Date(2025, 1, 1),
          },
        }),
      }),
    );
  });
});
