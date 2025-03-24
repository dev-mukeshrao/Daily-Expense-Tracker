import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    source: { type: String, required: true }, // Salary, Bonus, Freelance, etc.
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);
export default Income;
