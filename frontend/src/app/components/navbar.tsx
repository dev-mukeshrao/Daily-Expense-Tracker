"use client";

import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Container, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [incomeMenuAnchor, setIncomeMenuAnchor] = useState<null | HTMLElement>(null);

  const handleIncomeMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIncomeMenuAnchor(event.currentTarget);
  };

  const handleIncomeMenuClose = () => {
    setIncomeMenuAnchor(null);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#1976d2" }}>
      <Container>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* App Title */}
          <Typography variant="h6" sx={{ cursor: "pointer" }} onClick={() => router.push("/")}>
            Expense Tracker
          </Typography>

          {/* Navigation Buttons */}
          <div>
            <Button color="inherit" onClick={() => router.push("/add-expense")}>
              Add Expense
            </Button>
            <Button color="inherit" onClick={() => router.push("/add-category")}>
              Add Category
            </Button>

            {/* Income Dropdown Menu */}
            <Button color="inherit" onClick={handleIncomeMenuOpen}>
              Income ▼
            </Button>
            <Menu
              anchorEl={incomeMenuAnchor}
              open={Boolean(incomeMenuAnchor)}
              onClose={handleIncomeMenuClose}
            >
              <MenuItem onClick={() => { router.push("/income/add"); handleIncomeMenuClose(); }}>
                Add Income
              </MenuItem>
              <MenuItem onClick={() => { router.push("/income/history"); handleIncomeMenuClose(); }}>
                View Income History
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
