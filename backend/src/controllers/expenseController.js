
import Expense from "../models/Expense.js";
import Category from "../models/Category.js"; // Import Category model

// ✅ Add Expense with quantity & unitPrice calculation
export const addExpense = async (req, res) => {
    try {
        const { categoryId, quantity, date } = req.body;

        // 🔍 Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        // 💰 Calculate total amount
        const amount = quantity * category.unitPrice;

        // 📌 Create new expense
        const newExpense = new Expense({ category: categoryId, quantity, amount, date });
        await newExpense.save();

        res.status(201).json(newExpense);
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ error: "Failed to add expense" });
    }
};

// ✅ Get All Expenses with Category Details
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().populate("category", "name unitPrice unitType"); // 🛠 Populate category details
        res.json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
};
export const editExpense = async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  };
  

// ✅ Delete Expense
export const deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete expense" });
    }
};

// ✅ Expense Summary Grouped by Category
export const getExpenseSummary = async (req, res) => {
    try {
        const summary = await Expense.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" },
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            {
                $unwind: "$categoryDetails",
            },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    totalQuantity: 1,
                    categoryName: "$categoryDetails.name",
                    unitType: "$categoryDetails.unitType",
                },
            },
        ]);
        res.json(summary);
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ error: "Failed to fetch summary" });
    }
};
