"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

interface Income {
  _id: string;
  source: string;
  amount: number;
  date: string;
}

export default function IncomeHistoryPage() {
  const [incomeRecords, setIncomeRecords] = useState<Income[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    fetchIncomeRecords();
  }, []);

  const fetchIncomeRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/income");
      setIncomeRecords(response.data);
    } catch (error) {
      console.error("Error fetching income records:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this income record?")) {
      try {
        await axios.delete(`http://localhost:5001/api/income/${id}`);
        setIncomeRecords((prev) => prev.filter((record) => record._id !== id));
      } catch (error) {
        console.error("Error deleting income record:", error);
      }
    }
  };

  const filteredRecords = incomeRecords.filter((record) => {
    const recordDate = dayjs(record.date);
    return (
      (!startDate || recordDate.isAfter(startDate.subtract(1, "day"))) &&
      (!endDate || recordDate.isBefore(endDate.add(1, "day")))
    );
  });

  return (
    <Container maxWidth="md">
      <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
        Income History
      </Typography>

      {/* Date Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newDate) => setStartDate(newDate)}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newDate) => setEndDate(newDate)}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Source</b></TableCell>
              <TableCell><b>Amount (₹)</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{record.source}</TableCell>
                  <TableCell>₹{record.amount}</TableCell>
                  <TableCell>{dayjs(record.date).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(record._id)}>
                      <Delete />
                    </IconButton>
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
