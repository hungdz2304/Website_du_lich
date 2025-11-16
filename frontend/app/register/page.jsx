"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "finder", // default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function registerUser() {
    const payload = {
      username: formData.email,
      password: formData.password,
      role: formData.role,
    };
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res;
  }

  async function loginUser() {
    const payload = {
      username: formData.email,
      password: formData.password,
    };
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const regRes = await registerUser();
      const regData = await regRes.json();
      if (!regRes.ok) {
        setError(regData.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto-login after successful registration
      const loginRes = await loginUser();
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        // registration succeeded but login failed — redirect to login page and show message
        setError(
          loginData.error ||
            "Registration succeeded but auto-login failed. Please login."
        );
        router.push("/login");
        return;
      }

      const { token, user } = loginData;
      if (token) {
        // persist token so create page can read it
        try {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          // notify header and other tabs
          try {
            window.dispatchEvent(
              new CustomEvent("authChanged", { detail: { reload: false } })
            );
          } catch (e) {}
        } catch (e) {
          // fallback to sessionStorage
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));
          try {
            window.dispatchEvent(
              new CustomEvent("authChanged", { detail: { reload: false } })
            );
          } catch (e) {}
        }
      }

      // redirect to home or dashboard
      router.push("/");
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="main-content">
        <div className="register-container">
          <h2 className="register-title">Đăng Ký Tài Khoản iTOUR</h2>

          <form
            id="register-form"
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="full_name">Họ và Tên</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                placeholder="Nhập họ và tên"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">Xác nhận Mật khẩu</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Vai trò</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="finder">Finder (tìm tour)</option>
                <option value="poster">Poster (đăng tour)</option>
              </select>
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Đang xử lý…" : "Tạo Tài Khoản"}
            </button>

            <p className="login-link">
              Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}
