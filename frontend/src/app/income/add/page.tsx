"use client";

import { useState } from "react";
import { 
  TextField, Button, Container, Typography, 
  Paper, Box, CircularProgress 
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddIncomePage() {
  const router = useRouter();
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!source.trim() || !amount || !date) {
      return setError("Please fill in all fields");
    }
    if (Number(amount) <= 0) {
      return setError("Amount must be greater than 0");
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5001/api/income", {
        source: source.trim(),
        amount: Number(amount),
        date: date.format("YYYY-MM-DD"),
      });

      router.push("/"); // Redirect after adding
    } catch (error) {
      console.error("Error adding income:", error);
      setError("Failed to add income. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Add Income
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            ⚠ {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Income Source"
            fullWidth
            value={source}
            onChange={(e) => setSource(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Amount (₹)"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
            inputProps={{ min: "0.01", step: "0.01" }}
          />

          <DatePicker
            label="Select Date"
            value={date}
            onChange={(newDate) => setDate(newDate)}
            slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
          />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ py: 1.5, fontWeight: "bold", borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Add Income"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
