"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

export default function EditTourPage() {
  const router = useRouter();
  const params = useParams(); // for /tours/edit/[id]
  const searchParams = useSearchParams(); // fallback for ?id=
  const routeId = params?.id || searchParams?.get("id") || null;

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    departure: "",
    spots: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // token lookup helper (checks localStorage and sessionStorage)
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
          } catch (err) {
            if (k !== "user") return v;
          }
        }
      } catch (e) {
        // ignore
      }
    }
    return null;
  };

  // if the page is placed at /tours/edit (without dynamic segment) we also try to extract id from URL
  useEffect(() => {
    if (!routeId) {
      // last fallback: parse pathname like /tours/edit/123
      const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";
      const m = pathname.match(/\/tours\/edit\/([^\/?#]+)/);
      if (m && m[1]) {
        // set id from path
      }
    }
  }, [routeId]);

  useEffect(() => {
    if (!routeId) {
      setLoading(false);
      setError("Missing tour id in route or query string.");
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/tours/${routeId}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok)
          throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!mounted) return;
        setForm({
          name: data.name ?? "",
          // support both snake_case (from SQL) and camelCase (older API)
          description: data.description ?? data.desc ?? "",
          price: data.price != null ? String(data.price) : "",
          imageUrl: data.imageUrl ?? data.image_url ?? "",
          departure: data.departure ?? "",
          spots: data.spots != null ? String(data.spots) : "0",
        });
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [routeId, BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!routeId) return setError("Missing id");

    if (!form.name.trim()) return setError("Tên tour là bắt buộc.");

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        price: form.price ? Number(form.price) : null,
        imageUrl: form.imageUrl || null,
        departure: form.departure || null,
        spots: form.spots ? parseInt(form.spots, 10) : 0,
      };

      const token = getToken();
      if (!token) {
        setError("Bạn cần đăng nhập để chỉnh sửa tour.");
        router.push("/login");
        return;
      }

      const res = await fetch(`${BASE_URL}/tours/${routeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");
      router.push(`/tours/detail/${routeId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!routeId) return;
    if (!confirm("Xác nhận xoá tour này?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/tours/${routeId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Delete failed");
      router.push("/tours");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main style={{ padding: 24 }}>Đang tải...</main>;
  if (error)
    return <main style={{ padding: 24, color: "red" }}>Lỗi: {error}</main>;

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>Chỉnh sửa Tour</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 12, marginTop: 12 }}
      >
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
            rows={5}
          />
        </label>

        <label>
          Giá
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

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={saving}
            style={{ padding: "8px 12px" }}
            onClick={() => router.push(`/tours/detail/${routeId}`)}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/tours/detail/${routeId}`)}
            style={{ padding: "8px 12px" }}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            style={{
              padding: "8px 12px",
              background: "#dc3545",
              color: "#fff",
              border: "none",
            }}
          >
            {saving ? "Đang xoá..." : "Xoá"}
          </button>
        </div>
      </form>
    </main>
  );
}
