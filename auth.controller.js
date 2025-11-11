// auth.controller.js
const db = require("./connect"); // Import kết nối database
const bcrypt = require("bcryptjs"); // Import thư viện mã hóa
// const jwt = require('jsonwebtoken'); // Cần cho Công việc #3

// --- API Đăng ký (REGISTER - Công việc #2) ---
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({
          message: "Vui lòng điền đầy đủ Tên người dùng, Email và Mật khẩu.",
        });
    }

    // 2. Băm (Hash) mật khẩu trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Chèn dữ liệu vào bảng users
    const insertQuery = `
            INSERT INTO users (username, email, password_hash) 
            VALUES (?, ?, ?);
        `;
    const [result] = await db.execute(insertQuery, [
      username,
      email,
      passwordHash,
    ]);

    // 4. Trả lời thành công
    res.status(201).json({
      message: "Đăng ký tài khoản thành công!",
      userId: result.insertId,
    });
  } catch (error) {
    // Xử lý lỗi: Tên người dùng/Email đã tồn tại (ER_DUP_ENTRY)
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "Tên người dùng hoặc Email đã được sử dụng." });
    }
    console.error("Lỗi đăng ký:", error);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ.", error: error.message });
  }
};

// Hàm login sẽ được thêm vào trong Công việc #3
