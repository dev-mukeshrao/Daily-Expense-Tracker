"use client";

import { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, MenuItem } from "@mui/material";
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

  // Fetch categories from backend
  useEffect(() => {
    axios.get("http://localhost:5001/api/categories")
      .then(response => { 
        console.log("Fetched categories:", response.data);
        setCategories(response.data) 

      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  // Update unit price, unit type, and calculate amount
  const handleCategoryChange = (selectedId: string) => {
    setCategoryId(selectedId);
    const selectedCategory = categories.find(cat => cat._id === selectedId);
    
    if (selectedCategory) {
      setUnitPrice(selectedCategory.unitPrice);
      setUnitType(selectedCategory.unitType);
      handleQuantityChange(quantity);
    }
  };
  

  // Recalculate amount when quantity changes
  const handleQuantityChange = (qty: string) => {
    const sanitizedQty = Math.max(0, Number(qty)); // Prevent negative values
    setQuantity(String(sanitizedQty));
    setAmount(unitPrice * sanitizedQty);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !quantity || !date) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/api/expenses",
        {
          categoryId,
          quantity: Number(quantity),
          amount,
          date: date.format("YYYY-MM-DD"),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      router.push("/"); // Redirect after adding
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>Add Expense</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Category"
          fullWidth
          value={categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
          margin="normal"
        >
          {Array.isArray(categories) && categories.map((cat) => (
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
          disabled
          margin="normal"
        />

        <DatePicker
          label="Select Date"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Add Expense
        </Button>
      </form>
    </Container>
  );
}
