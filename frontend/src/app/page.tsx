"use client";

import { useEffect, useState } from "react";
import { 
  Container, Typography, List, ListItem, ListItemText, Paper, Button, IconButton 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface Expense {
  _id: string;
  category: { _id: string; name: string };
  quantity: number;
  amount: number;
  date: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const router = useRouter();

  // Fetch Expenses
  useEffect(() => {
    axios.get("http://localhost:5001/api/expenses")
      .then(response => setExpenses(response.data))
      .catch(error => console.error("Error fetching expenses:", error));
  }, []);

  // Delete Expense
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    
    try {
      await axios.delete(`http://localhost:5001/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id)); // Remove from state
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Edit Expense
  const handleEdit = (id: string) => {
    router.push(`/edit-expense/${id}`);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Expense Tracker</Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => router.push("/add-expense")} 
        sx={{ mb: 2 }}>
        Add Expense
      </Button>

      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {expenses.map((expense) => (
            <ListItem 
              key={expense._id} 
              secondaryAction={
                <>
                  <IconButton onClick={() => handleEdit(expense._id)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(expense._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText 
                primary={`${dayjs(expense.date).format("DD MMM YYYY")} - ${expense.category?.name}`} 
                secondary={`Qty: ${expense.quantity} | ₹${expense.amount}`} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
