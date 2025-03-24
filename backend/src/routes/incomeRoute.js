import express from "express";
import { addIncome, getIncomeHistory, deleteIncome } from "../controllers/incomeController.js";

const router = express.Router();

router.post("/", addIncome); // Add Income
router.get("/", getIncomeHistory); // Get Income History
router.delete("/:id", deleteIncome); // Delete Income

export default router;
