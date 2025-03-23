"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Container, Typography, TextField, Button, MenuItem } from "@mui/material";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface Category {
  _id: string;
  name: string;
  unitPrice: number;
  unitType: string;
}

interface Expense {
  _id: string;
  category: string;
  quantity: number;
  amount: number;
  date: string;
}

export default function EditExpensePage() {
  const { id } = useParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:5001/api/categories`)
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));

    axios.get(`http://localhost:5001/api/expenses/${id}`)
      .then(response => {
        const exp = response.data;
        setExpense(exp);
        setCategoryId(exp.category._id);
        setQuantity(String(exp.quantity));
        setDate(dayjs(exp.date));
        setAmount(exp.amount);
      })
      .catch(error => console.error("Error fetching expense:", error));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/expenses/${id}`, {
        categoryId,
        quantity: Number(quantity),
        amount,
        date: date?.format("YYYY-MM-DD"),
      });
      router.push("/");
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>Edit Expense</Typography>
      {expense && (
        <form onSubmit={handleUpdate}>
          <TextField
            select
            label="Category"
            fullWidth
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            margin="normal"
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name} (₹{cat.unitPrice}/{cat.unitType})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="normal"
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
            Update Expense
          </Button>
        </form>
      )}
    </Container>
  );
}
