// index.js (File chính của Server)
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authController = require("./auth.controller"); // Import controller

const app = express();
const PORT = 3000;

// Middleware (Sử dụng các công cụ phụ trợ)
app.use(cors()); // Cho phép Frontend gọi API
app.use(bodyParser.json()); // Đọc dữ liệu JSON từ request body

// --- ĐỊNH TUYẾN API (ROUTES) ---

// Tuyến cho Đăng ký (REGISTER - Công việc #2)
// Tuyến: POST http://localhost:3000/api/auth/register
app.post("/api/auth/register", authController.register);

// Tuyến cho Đăng nhập (sẽ được code trong Công việc #3)
// app.post('/api/auth/login', authController.login);

// Khởi chạy Server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(
    `Kiểm tra API Đăng ký tại: POST http://localhost:${PORT}/api/auth/register`
  );
});
