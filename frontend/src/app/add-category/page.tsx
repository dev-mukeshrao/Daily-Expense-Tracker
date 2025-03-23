"use client";

import { useState } from "react";
import { TextField, Button, Container, Typography, MenuItem } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";

const unitTypes = ["liter", "kilogram", "piece", "gram", "dozen"];

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [unitType, setUnitType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !unitPrice || !unitType) return alert("Please fill in all fields");

    try {
      await axios.post("http://localhost:5001/api/categories", {
        name,
        unitPrice: Number(unitPrice),
        unitType,
      });

      router.push("/"); // Redirect after adding
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>Add Category</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Unit Price (₹ per unit)"
          type="number"
          fullWidth
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          margin="normal"
        />
        <TextField
          select
          label="Unit Type"
          fullWidth
          value={unitType}
          onChange={(e) => setUnitType(e.target.value)}
          margin="normal"
        >
          {unitTypes.map((unit) => (
            <MenuItem key={unit} value={unit}>{unit}</MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Add Category
        </Button>
      </form>
    </Container>
  );
}
