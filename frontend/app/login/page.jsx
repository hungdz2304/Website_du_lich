// ...existing code...
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // helper to call backend with token
  function apiFetch(path, opts = {}) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || sessionStorage.getItem("token")
        : null;
    const headers = {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${API_BASE}${path}`, { ...opts, headers });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // backend expects { username, password } — using email as username
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      const { token, user } = data;
      if (!token) {
        setError("No token returned");
        setLoading(false);
        return;
      }

      // store token (persist if remember checked)
      if (formData.remember) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        // notify other components / tabs
        try {
          window.dispatchEvent(
            new CustomEvent("authChanged", { detail: { reload: false } })
          );
        } catch (e) {}
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        try {
          window.dispatchEvent(
            new CustomEvent("authChanged", { detail: { reload: false } })
          );
        } catch (e) {}
      }

      // optional: fetch /auth/me to validate token using apiFetch
      // const me = await apiFetch('/auth/me').then(r => r.json());

      // redirect to home (or dashboard)
      router.push("/");
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center mt-5 mb-5">
      <div className="login-container">
        <h2 className="login-title">Đăng Nhập Tài Khoản iTOUR</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Email
            </label>
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
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="link-options">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Ghi nhớ đăng nhập
            </label>
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang đăng nhập…" : "Đăng Nhập"}
          </button>
        </form>

        <p className="register-link">
          Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  );
}
// ...existing code...
