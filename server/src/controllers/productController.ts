import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ------------------ Get all products (any logged-in user) ------------------ */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const search = req.query.search?.toString();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const whereCondition: any = {};
    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { id: { contains: search } },
      ];
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { name: "asc" },
        include: { sales: true, purchases: true },
      }),
      prisma.product.count({ where: whereCondition }),
    ]);

    res.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

/* ------------------ Get product by ID (any logged-in user) ------------------ */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { sales: true, purchases: true },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving product" });
  }
};

/* ------------------ Create new product (Admin only) ------------------ */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, rating, stockQuantity } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        rating: rating ? parseFloat(rating) : null,
        stockQuantity: parseInt(stockQuantity),
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};

/* ------------------ Update product (Admin only) ------------------ */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, rating, stockQuantity } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (rating !== undefined) updateData.rating = rating ? parseFloat(rating) : null;
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json(product);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(500).json({ message: "Error updating product" });
    }
  }
};

/* ------------------ Delete product (Admin only) ------------------ */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { sales: true, purchases: true },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.sales.length > 0 || product.purchases.length > 0) {
      return res.status(400).json({ message: "Cannot delete product with related records" });
    }

    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(500).json({ message: "Error deleting product" });
    }
  }
};

/* ------------------ Product statistics (any logged-in user) ------------------ */
export const getProductStats = async (_req: Request, res: Response) => {
  try {
    const stats = await prisma.product.aggregate({
      _count: { id: true },
      _avg: { price: true, rating: true },
      _sum: { stockQuantity: true },
      _min: { price: true, stockQuantity: true },
      _max: { price: true, stockQuantity: true },
    });

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving product statistics" });
  }
};
