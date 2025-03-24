"use client";

import { useState, useEffect } from "react";
import { 
  TextField, Button, Container, Typography, 
  MenuItem, Paper, Box, CircularProgress, Switch, FormControlLabel 
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  unitPrice: number;
  unitType: string;
}

export default function AddExpensePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [unitPrice, setUnitPrice] = useState(0);
  const [unitType, setUnitType] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recurring Expense States
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5001/api/categories")
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const handleCategoryChange = (selectedId: string) => {
    setCategoryId(selectedId);
    const selectedCategory = categories.find(cat => cat._id === selectedId);
    if (selectedCategory) {
      setUnitPrice(selectedCategory.unitPrice);
      setUnitType(selectedCategory.unitType);
      handleQuantityChange(quantity);
    }
  };

  const handleQuantityChange = (qty: string) => {
    const sanitizedQty = Math.max(0, Number(qty));
    setQuantity(String(sanitizedQty));
    setAmount(unitPrice * sanitizedQty);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId || !quantity || !date) {
      return setError("Please fill in all fields");
    }

    if (isRecurring && !frequency) {
      return setError("Please select a frequency for the recurring expense.");
    }
    
    try {
      setLoading(true);
      await axios.post("http://localhost:5001/api/expenses/recurring", {
        categoryId,
        quantity: Number(quantity),
        amount,
        date: date.format("YYYY-MM-DD"),
        isRecurring,
        frequency: isRecurring ? frequency : null,
      });
      router.push("/");
    } catch (error) {
      console.error("Error adding expense:", error);
      setError("Failed to add expense. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Add Expense
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            ⚠ {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Category"
            fullWidth
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            margin="normal"
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name} (₹{cat.unitPrice}/{cat.unitType})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={`Quantity (${unitType || "units"})`}
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            margin="normal"
            disabled={!categoryId}
          />

          <TextField
            label="Total Amount"
            type="number"
            fullWidth
            value={amount}
            margin="normal"
            disabled
          />

          <DatePicker
            label="Select Date"
            value={date}
            onChange={(newDate) => setDate(newDate)}
            slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
          />

          {/* Recurring Expense Toggle */}
          <FormControlLabel
            control={
              <Switch 
                checked={isRecurring} 
                onChange={(e) => setIsRecurring(e.target.checked)} 
              />
            }
            label="Make this a recurring expense"
            sx={{ mt: 2 }}
          />

          {/* Frequency Dropdown (Only visible if isRecurring is true) */}
          {isRecurring && (
            <TextField
              select
              label="Recurring Frequency"
              fullWidth
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              margin="normal"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </TextField>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ py: 1.5, fontWeight: "bold", borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Add Expense"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
