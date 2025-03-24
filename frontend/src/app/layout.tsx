"use client";

import { ReactNode } from "react";
import { CssBaseline, Container } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Navbar from "./components/navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Expense Tracker</title>
      </head>
      <body>
        <CssBaseline />
        <Navbar />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* ✅ Added wrapper to prevent content from going under navbar */}
          <main style={{ paddingTop: "80px", minHeight: "100vh" }}>
            {children}
          </main>
        </LocalizationProvider>
      </body>
    </html>
  );
}
