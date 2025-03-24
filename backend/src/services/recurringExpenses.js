import Expense from "../models/Expense.js";
import dayjs from "dayjs";

// 📌 Process Recurring Expenses (Runs Daily)
export const processRecurringExpenses = async () => {
  try {
    const today = dayjs().startOf("day").toDate();
    
    const recurringExpenses = await Expense.find({
      isRecurring: true,
      nextOccurrence: { $lte: today },
    });

    for (const expense of recurringExpenses) {
      const newExpense = new Expense({
        categoryId: expense.categoryId,
        quantity: expense.quantity,
        amount: expense.amount,
        date: today,
        isRecurring: true,
        frequency: expense.frequency,
        nextOccurrence: calculateNextOccurrence(today, expense.frequency),
      });

      await newExpense.save();

      // Update original recurring expense with new nextOccurrence date
      await Expense.findByIdAndUpdate(expense._id, {
        nextOccurrence: newExpense.nextOccurrence,
      });
    }

    console.log(`Processed ${recurringExpenses.length} recurring expenses.`);
  } catch (error) {
    console.error("Error processing recurring expenses:", error);
  }
};

// Schedule this job to run every day at midnight
import cron from "node-cron";
cron.schedule("0 0 * * *", processRecurringExpenses); // Runs daily at 00:00 AM
