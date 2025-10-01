import { Router } from "express";
import { authMiddleware, requireAdmin } from "../middlewares/authMiddleware";
import { getExpensesByCategory } from "../controllers/expenseController";

const router = Router();

// Protect all expense routes
router.use(authMiddleware);

// GET /expenses → any logged-in user
router.get("/", getExpensesByCategory);

// Example: if you later add admin-only expense creation
// router.post("/", requireAdmin, createExpense);

export default router;
