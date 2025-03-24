"use client";

import { useState } from "react";
import { 
  TextField, Button, Container, Typography, 
  MenuItem, Paper, Box, CircularProgress 
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";

const unitTypes = ["liter", "kilogram", "piece", "gram", "dozen"];

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [unitType, setUnitType] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !unitPrice || !unitType) {
      return setError("Please fill in all fields");
    }
    if (Number(unitPrice) <= 0) {
      return setError("Unit Price must be greater than 0");
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5001/api/categories", {
        name: name.trim(),
        unitPrice: Number(unitPrice),
        unitType,
      });

      router.push("/"); // Redirect after adding
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm"> {/* Added mt: 12 to prevent navbar overlap */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Add New Category
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            ⚠ {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Category Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            sx={{ borderRadius: 2 }}
          />
          <TextField
            label="Unit Price (₹ per unit)"
            type="number"
            fullWidth
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            margin="normal"
            inputProps={{ min: "0.01", step: "0.01" }}
            sx={{ borderRadius: 2 }}
          />
          <TextField
            select
            label="Unit Type"
            fullWidth
            value={unitType}
            onChange={(e) => setUnitType(e.target.value)}
            margin="normal"
            sx={{ borderRadius: 2 }}
          >
            {unitTypes.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ py: 1.5, fontWeight: "bold", borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Add Category"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
