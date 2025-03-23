import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// Add Category
router.post("/", async (req, res) => {
  try {
    const { name, unitPrice, unitType } = req.body;
    const newCategory = new Category({ name, unitPrice, unitType });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error });
  }
});

// Get All Categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

export default router;
