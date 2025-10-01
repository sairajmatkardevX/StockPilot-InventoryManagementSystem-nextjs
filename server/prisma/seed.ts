import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface SeedMapping {
  file: string;
  model: any;
  idField: string;
}

const seedMappings: SeedMapping[] = [
  { file: "users.json", model: prisma.user, idField: "userId" },
  { file: "products.json", model: prisma.product, idField: "productId" },
  { file: "sales.json", model: prisma.sale, idField: "saleId" },
  { file: "purchases.json", model: prisma.purchase, idField: "purchaseId" },
  { file: "expenses.json", model: prisma.expense, idField: "expenseId" },
  { file: "salesSummary.json", model: prisma.salesSummary, idField: "salesSummaryId" },
  { file: "purchaseSummary.json", model: prisma.purchaseSummary, idField: "purchaseSummaryId" },
  { file: "expenseSummary.json", model: prisma.expenseSummary, idField: "expenseSummaryId" },
  { file: "expenseByCategory.json", model: prisma.expenseByCategory, idField: "expenseByCategoryId" },
];

// Clear all existing data
async function clearAllData() {
  for (const mapping of seedMappings) {
    await mapping.model.deleteMany({});
    console.log(`Cleared data from ${mapping.file}`);
  }
}

async function main() {
  const dataDir = path.join(__dirname, "seedData");

  await clearAllData();

  for (const mapping of seedMappings) {
    const filePath = path.join(dataDir, mapping.file);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const data of jsonData) {
      const idValue = data[mapping.idField];
      const createData: any = { ...data };

      // Remove old id field
      delete createData[mapping.idField];

      // Special handling for User
      if (mapping.file === "users.json") {
        createData.password = await bcrypt.hash(createData.password || "default123", 10);
        createData.role = createData.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER";
      } else {
        // Set explicit id for other models
        createData.id = idValue;
      }

      await mapping.model.create({ data: createData });
    }

    console.log(`Seeded ${mapping.file}`);
  }
}

main()
  .catch((err) => console.error("Seeding failed:", err))
  .finally(async () => {
    await prisma.$disconnect();
  });
