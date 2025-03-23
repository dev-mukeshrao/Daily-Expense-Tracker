// app/layout.tsx
"use client";  // ✅ Required for client-side interactivity

import { ReactNode } from "react";
import { CssBaseline, Container } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Expense Tracker</title>
      </head>
      <body>
        <CssBaseline />  {/* ✅ MUI Global Styles */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
      </body>
    </html>
  );
}
