
import Expense from "../models/Expense.js";
import Category from "../models/Category.js"; // Import Category model
import dayjs from "dayjs";

// ✅ Add Expense with quantity & unitPrice calculation
export const addExpense = async (req, res) => {
    try {


      console.log("Adding expense -- ", req.body);
      
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


export const getExpenseById = async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  };

// Update an existing expense
export const updateExpense = async (req, res) => {
  try {
    const { categoryId, quantity, amount, date } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { category: categoryId, quantity, amount, date },
      { new: true } // Returns the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: "Failed to update expense" });
  }
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


// 📌 Add Recurring Expense
export const handleRecurringExpenses = async (req, res) => {
  try {
    const { categoryId, quantity, amount, date, isRecurring, frequency } = req.body;
    console.log("IsRecurring : ", isRecurring);
    const category = await Category.findById(categoryId);
    if (isRecurring && !frequency) {
      return res.status(400).json({ message: "Frequency is required for recurring expenses" });
    }

    // Calculate next occurrence date
    let nextOccurrence = null;
    if (isRecurring) {
      nextOccurrence = calculateNextOccurrence(date, frequency);
    }

    const expense = new Expense({
      category,
      quantity,
      amount,
      date,
      isRecurring,
      frequency,
      nextOccurrence,
    });

    await expense.save();
    res.status(201).json({ message: "Recurring expense added successfully", expense });
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error });
  }
};

// 📌 Function to Calculate Next Occurrence
const calculateNextOccurrence = (date, frequency) => {
  switch (frequency) {
    case "daily":
      return dayjs(date).add(1, "day").toDate();
    case "weekly":
      return dayjs(date).add(1, "week").toDate();
    case "monthly":
      return dayjs(date).add(1, "month").toDate();
    case "yearly":
      return dayjs(date).add(1, "year").toDate();
    default:
      return null;
  }
};

export const toggleRecurringExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.isRecurring = !expense.isRecurring; // Toggle the recurring state
    await expense.save();

    res.json({ message: "Recurring status updated", expense });
  } catch (error) {
    console.error("Error updating recurring status:", error);
    res.status(500).json({ message: "Failed to update expense" });
  }
};



