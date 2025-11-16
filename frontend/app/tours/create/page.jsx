"use client";
// filepath: c:\Users\admin\Desktop\lab\test\Website_du_lich\frontend\app\tours\create\page.jsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTourPage() {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    departure: "",
    spots: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Tên tour là bắt buộc.");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description || null,
      price: form.price ? Number(form.price) : null,
      imageUrl: form.imageUrl || null,
      departure: form.departure || null,
      spots: form.spots ? parseInt(form.spots, 10) : 0,
    };

    // read token from localStorage or sessionStorage (try common keys)
    const getToken = () => {
      if (typeof window === "undefined") return null;
      const keys = ["token", "authToken", "accessToken", "user"];
      const stores = [localStorage, sessionStorage];
      for (const store of stores) {
        try {
          for (const k of keys) {
            const v = store.getItem(k);
            if (!v) continue;
            try {
              const parsed = JSON.parse(v);
              if (parsed && parsed.token) return parsed.token;
              // if it's an object without token, continue
            } catch (err) {
              // not JSON
              if (k !== "user") return v;
            }
          }
        } catch (e) {
          // ignore storage access errors and continue
        }
      }
      return null;
    };

    const token = getToken();
    if (!token) {
      setError("Bạn cần đăng nhập để tạo tour. Vui lòng đăng nhập.");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/tours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Lỗi khi tạo tour");
      }

      // success -> navigate to tours list
      router.push("/tours");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Tạo Tour Mới</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Tên tour *
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mô tả
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
        </label>

        <label>
          Giá (số)
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            step="0.01"
          />
        </label>

        <label>
          Ảnh (URL)
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
          />
        </label>

        <label>
          Khởi hành
          <input
            name="departure"
            value={form.departure}
            onChange={handleChange}
          />
        </label>

        <label>
          Số chỗ
          <input
            name="spots"
            value={form.spots}
            onChange={handleChange}
            type="number"
          />
        </label>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 12px" }}
        >
          {loading ? "Đang lưu..." : "Tạo tour"}
        </button>
      </form>
    </main>
  );
}
