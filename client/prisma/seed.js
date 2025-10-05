"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const seedMappings = [
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
    const dataDir = path_1.default.join(__dirname, "seedData");
    await clearAllData();
    for (const mapping of seedMappings) {
        const filePath = path_1.default.join(dataDir, mapping.file);
        const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
        for (const data of jsonData) {
            const idValue = data[mapping.idField];
            const createData = { ...data };
            // Remove old id field
            delete createData[mapping.idField];
            // Special handling for User
            if (mapping.file === "users.json") {
                createData.password = await bcryptjs_1.default.hash(createData.password || "default123", 10);
                createData.role = createData.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER";
            }
            else {
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
