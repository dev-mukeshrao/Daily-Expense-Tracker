"use client";

import { useEffect, useState } from "react";
import { 
  Container, Typography, Card, CardContent, CardActions, 
  IconButton, Fab, Box, Switch, Grid 
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface Expense {
  _id: string;
  category: { _id: string; name: string };
  quantity: number;
  amount: number;
  date: string;
  isRecurring: boolean;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://localhost:5001/api/expenses")
      .then(response => setExpenses(response.data))
      .catch(error => console.error("Error fetching expenses:", error));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleToggleRecurring = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5001/api/expenses/${id}/toggle-recurring`);
      setExpenses(expenses.map(exp =>
        exp._id === id ? { ...exp, isRecurring: !exp.isRecurring } : exp
      ));
    } catch (error) {
      console.error("Error updating recurring status:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 12, pb: 8 }}> 
      <Typography variant="h4" align="center" gutterBottom>
        Expense Tracker
      </Typography>

      {expenses.length > 0 ? (
        <Grid container spacing={2} justifyContent="center">
          {expenses.map((expense) => (
            <Grid item xs={12} sm={6} md={2.4} key={expense._id}>
              <Card sx={{ 
                p: 2, borderRadius: 3, 
                boxShadow: 4, transition: "0.3s", 
                "&:hover": { boxShadow: 6 },
                maxWidth: 200, // Ensures small card size
                mx: "auto" // Centers the card
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{expense.category?.name}</Typography>
                  <Typography color="textSecondary">📅 {dayjs(expense.date).format("DD/MM/YYYY")}</Typography>
                  <Typography>🔢 Quantity: {expense.quantity}</Typography>
                  <Typography color="primary" fontWeight="bold">💰 Total: ₹{expense.amount}</Typography>
                  <Typography sx={{ color: expense.isRecurring ? "green" : "gray" }}>
                    🔄 Recurring: {expense.isRecurring ? "Yes" : "No"}
                  </Typography>
                </CardContent>

                <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Switch
                    checked={expense.isRecurring}
                    onChange={() => handleToggleRecurring(expense._id)}
                    color="primary"
                  />
                  
                  <Box>
                    <IconButton 
                      color="primary" 
                      onClick={() => router.push(`/edit-expense/${expense._id}`)} 
                      sx={{ transition: "0.2s", "&:hover": { transform: "scale(1.1)" } }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(expense._id)}
                      sx={{ transition: "0.2s", "&:hover": { transform: "scale(1.1)" } }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography align="center" color="textSecondary">
          No expenses recorded yet.
        </Typography>
      )}

      {/* Floating "Add Expense" Button */}
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <Fab 
          color="primary" 
          aria-label="add" 
          onClick={() => router.push("/add-expense")}
          sx={{ 
            boxShadow: 4, 
            transition: "0.3s", 
            "&:hover": { boxShadow: 6, transform: "scale(1.1)" } 
          }}
        >
          <Add />
        </Fab>
      </Box>
    </Container>
  );
}
