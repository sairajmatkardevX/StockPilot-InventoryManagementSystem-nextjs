import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getDashboardMetrics } from "../controllers/dashboardController";

const router = Router();

// Protect all dashboard routes
router.use(authMiddleware);

// GET /dashboard → any logged-in user
router.get("/", getDashboardMetrics);

export default router;
