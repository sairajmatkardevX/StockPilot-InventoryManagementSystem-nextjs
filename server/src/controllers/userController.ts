import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

/* ------------------ Get all users ------------------ */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });

    const isAdmin = req.currentUser?.role === "ADMIN";

    const mappedUsers = users.map(u => ({
      userId: u.id,
      name: u.name,
      role: u.role,
      ...(isAdmin && { email: u.email }), // email only for admin
    }));

    res.json(mappedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ------------------ Get user by ID (Admin only) ------------------ */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

/* ------------------ Create new user (Admin only) ------------------ */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    res.status(201).json({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: "Email already exists or invalid data" });
  }
};

/* ------------------ Update user (Admin only) ------------------ */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { name, email, password, role } = req.body;

    const updateData: any = { name, email, role };
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({
      userId: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to update user" });
  }
};

/* ------------------ Delete user (Admin only) ------------------ */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    await prisma.user.delete({ where: { id: userId } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to delete user" });
  }
};
