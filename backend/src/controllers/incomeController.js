import Income from "../models/Income.js";

// ✅ Add Income
export const addIncome = async (req, res) => {
  try {
    const { source, amount, date, notes } = req.body;

    if (!source || !amount) {
      return res.status(400).json({ message: "Source and Amount are required" });
    }

    const newIncome = new Income({ source, amount, date, notes });
    await newIncome.save();
    res.status(201).json({ message: "Income added successfully", income: newIncome });
  } catch (error) {
    res.status(500).json({ message: "Error adding income", error });
  }
};

// 📜 Fetch Income History
export const getIncomeHistory = async (req, res) => {
  try {
    const incomes = await Income.find().sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching income history", error });
  }
};

// ❌ Delete Income
export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    await Income.findByIdAndDelete(id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting income", error });
  }
};


