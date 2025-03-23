import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

export default mongoose.model("Expense", ExpenseSchema, "expenses");
