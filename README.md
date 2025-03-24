# Daily Expense Tracker

## 🚀 Overview
The **Daily Expense Tracker** is a web application that helps users manage their daily expenses efficiently. It allows users to add, edit, delete, and categorize expenses, visualize spending trends, and manage recurring expenses.

## 📌 Features
- ✅ Add, Edit, and Delete Expenses
- ✅ Categorize Expenses (Milk, Vegetables, Food, etc.)
- ✅ Recurring Expenses Management
- ✅ Expense Visualization with Charts/Graphs
- ✅ Secure User Authentication (Upcoming)
- ✅ Cloud Storage for Receipts (Upcoming)
- ✅ Multi-Currency Support (Upcoming)

## 🛠️ Tech Stack
### **Frontend (Next.js + MUI)**
- **Next.js (TypeScript)** - Framework for server-side rendering
- **Material-UI (MUI)** - UI component library
- **Axios** - API requests handling
- **Day.js** - Date formatting

### **Backend (Node.js + Express + MongoDB)**
- **Node.js + Express.js** - Backend API
- **MongoDB (Mongoose)** - NoSQL Database
- **JWT Authentication** (Upcoming)
- **Cloud Storage (AWS S3, Firebase, or Cloudinary)** (Upcoming)

## 📂 Folder Structure
```
root/
│── backend/              # Backend (Node.js + Express + MongoDB)
│── frontend/             # Frontend (Next.js + TypeScript + MUI)
│── .gitignore            # Files to ignore in git
│── package.json          # Dependencies and scripts
│── README.md             # Project documentation
```

## 🚀 Getting Started

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yourusername/daily-expense-tracker.git
cd daily-expense-tracker
```

### **2️⃣ Setup Backend**
```sh
cd backend
npm install
npm run dev  # Starts backend on http://localhost:5001
```

### **3️⃣ Setup Frontend**
```sh
cd frontend
npm install
npm run dev  # Starts frontend on http://localhost:3000
```

## ⚙️ API Endpoints (Backend)
| Method | Endpoint | Description |
|--------|---------|-------------|
| `GET`  | `/api/expenses` | Fetch all expenses |
| `POST` | `/api/expenses/recurring` | Add a recurring expense |
| `PATCH` | `/api/expenses/:id/toggle-recurring` | Toggle recurring expense |
| `DELETE` | `/api/expenses/:id` | Delete an expense |

## 🎯 Future Enhancements
- 🔒 **User Authentication (Login/Signup)**
- 📊 **Advanced Expense Insights & Trends**
- ☁️ **Cloud Storage for Receipts**
- 📆 **Budgeting & Financial Planning**

## 💡 Contributing
Feel free to contribute by forking the repo and submitting a pull request! 😊

## 📜 License
MIT License © 2025 Mukeshsingh Rao

