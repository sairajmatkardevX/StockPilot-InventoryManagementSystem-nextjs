import express from "express";
import { authMiddleware, requireAdmin } from "../middlewares/authMiddleware";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

// Apply JWT auth to all routes
router.use(authMiddleware);

// Routes
router.get("/", getAllUsers);        // Anyone logged in can GET (filtered by role)
router.get("/:id", requireAdmin, getUserById); // Only admin can get specific user details
router.post("/", requireAdmin, createUser);    // Admin only
router.put("/:id", requireAdmin, updateUser);  // Admin only
router.delete("/:id", requireAdmin, deleteUser); // Admin only

export default router;
