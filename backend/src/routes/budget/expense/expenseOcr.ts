import { authMiddleware } from "@/middleware/authMiddleware";
import { FastifyInstance } from "fastify";
import path from "path";
import * as Tesseract from "tesseract.js";
import fs from "fs/promises";
import { db } from "@/db";

import fastifyMultipart from "@fastify/multipart";

export async function expenseOcr(server: FastifyInstance) {
  server.register(fastifyMultipart);

  server.post(
    "/expense/ocr",
    {
      preHandler: authMiddleware,
    },
    async (request, reply) => {
      try {
        if (!request.user)
          return reply.status(401).send({ error: "Unauthorized" });

        const userId = request.user.id;

        const file = await request.file();
        if (!file) return reply.status(400).send({ error: "No file uploaded" });

        const uploadDir = path.join(process.cwd(), "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, file.filename);
        await fs.writeFile(filePath, await file.toBuffer());

        const result = await Tesseract.recognize(filePath, "pol");
        const text = result.data.text;

        const amountMatch = text.match(/(\d+[.,]\d{2})\s?(PLN|zł)?/i);
        const dateMatch = text.match(/(\d{2}[./-]\d{2}[./-]\d{4})/);
        const storeName =
          text
            .split("\n")
            .find((l) => l.length > 3)
            ?.trim() ?? "Nieznany sklep";

        const parsed = {
          amount: amountMatch
            ? parseFloat(amountMatch[1].replace(",", "."))
            : 0,
          date: dateMatch
            ? new Date(dateMatch[1].replace(/[-.]/g, "/"))
            : new Date(),
          description: storeName,
          category: "Zakupy",
        };

        const expense = await db.expense.create({
          data: {
            amount: parsed.amount,
            date: parsed.date,
            description: parsed.description,
            category: parsed.category,
            budget: {
              connectOrCreate: {
                where: {
                  userId_name: {
                    userId,
                    name: "Default Budget",
                  },
                },
                create: {
                  userId,
                  name: "Default Budget",
                  total: 0,
                },
              },
            },
          },
        });

        return reply.status(201).send(expense);
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "OCR processing failed" });
      }
    }
  );
}
