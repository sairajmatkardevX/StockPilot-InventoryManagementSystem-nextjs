import express from "express";
import { authMiddleware, requireAdmin } from "../middlewares/authMiddleware";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} from "../controllers/productController";

const router = express.Router();

// Apply JWT auth for all product routes
router.use(authMiddleware);

// Accessible by any logged-in user
router.get("/", getProducts);
router.get("/stats/all", getProductStats); // ✅ must come before :id
router.get("/:id", getProductById);

// Admin-only actions
router.post("/", requireAdmin, createProduct);
router.put("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;
