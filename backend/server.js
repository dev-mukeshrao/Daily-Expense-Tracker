import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import expenseRoutes from './src/routes/expenseRoute.js';
import categoryRoutes from './src/routes/categoryRoute.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/expenses', expenseRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
