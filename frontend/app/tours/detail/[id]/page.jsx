"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TourDetailPage({ params }) {
  const { id } = React.use(params);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [tour, setTour] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  var form = {
    userId: "",
    tourId: "",
    quantity: 0,
  };
  useEffect(() => {
    // read user from storage
    try {
      const raw =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
      raw ? (form.userId = JSON.parse(raw)) : null;
    } catch (e) {
      setUser(null);
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/tours/${id}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        setTour(data);
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
  }, [id, BASE_URL]);

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

  const handleDelete = async () => {
    if (!confirm("Xác nhận xoá tour này?")) return;
    setSaving(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/tours/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Delete failed");
      router.push("/tours");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleEdit = () => {
    router.push(`/tours/edit/${id}`);
  };

  const handleBooking = async () => {
    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập để đặt tour");
      router.push("/login");
      return;
    }

    if (!user || !tour) {
      setError("Thông tin người dùng hoặc tour chưa sẵn sàng");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (!user || !tour) {
        setError("Thông tin người dùng hoặc tour chưa sẵn sàng");
        return;
      }

      const payload = {
        tourId: tour.id,
        quantity: 1,
      };
      console.log("Payload:", payload);

      const res = await fetch(`${BASE_URL}/bills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Đặt tour thất bại");

      alert(`Đặt tour thành công!\nTour: ${tour.name}`);
      router.replace("/tours");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main style={{ padding: 24 }}>Đang tải...</main>;
  if (error)
    return <main style={{ padding: 24, color: "red" }}>Lỗi: {error}</main>;
  if (!tour) return <main style={{ padding: 24 }}>Không tìm thấy tour.</main>;

  const imgValid =
    typeof tour.image_url === "string" &&
    /\.(jpe?g|png|webp|avif|gif|svg)(\?.*)?$/i.test(tour.image_url);

  const isPoster = user && user.role === "poster";

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          {imgValid ? (
            <Image
              src={tour.imageUrl}
              alt={tour.name}
              width={200}
              height={380}
              style={{
                width: "100%",
                height: 380,
                objectFit: "cover",
                borderRadius: 8,
                display: "block",
              }}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 380,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f2f2f2",
                borderRadius: 8,
                color: "#777",
              }}
            >
              No image
            </div>
          )}
        </div>

        <aside
          style={{
            width: 300,
            background: "#fff",
            padding: 16,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>{tour.name}</h2>
          <p style={{ margin: "8px 0", color: "#ff6600", fontWeight: 700 }}>
            {tour.price != null
              ? `${Number(tour.price).toLocaleString("vi-VN")}₫`
              : "Liên hệ"}
          </p>
          <p style={{ margin: "6px 0", color: "#555" }}>
            <strong>Khởi hành:</strong> {tour.departure || "Tùy chọn"}
          </p>
          <p style={{ margin: "6px 0", color: "#555" }}>
            <strong>Còn:</strong> {tour.spots ?? 0} chỗ
          </p>
          <p style={{ margin: "6px 0", color: "#777", fontSize: 12 }}>
            {tour.createdAt
              ? `Tạo: ${new Date(tour.createdAt).toLocaleString()}`
              : null}
          </p>

          {!isPoster && !user && (
            <div
              style={{
                background: "#e7f3ff",
                border: "1px solid #b3d9ff",
                padding: 12,
                marginTop: 12,
                borderRadius: 4,
              }}
            >
              <p style={{ margin: 0, color: "#004085", fontSize: 12 }}>
                📝{" "}
                <a
                  href="/login"
                  style={{ color: "#004085", fontWeight: "bold" }}
                >
                  Đăng nhập
                </a>{" "}
                để đặt tour
              </p>
            </div>
          )}

          {isPoster && (
            <div
              style={{
                background: "#fff3cd",
                border: "1px solid #ffc107",
                padding: 12,
                marginTop: 12,
                borderRadius: 4,
              }}
            >
              <p style={{ margin: 0, color: "#856404", fontSize: 12 }}>
                📝 Bạn là <strong>poster</strong> — không thể đặt tour của mình
              </p>
            </div>
          )}

          <div
            style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}
          >
            <button
              onClick={() => router.push("/tours")}
              style={{ flex: 1, padding: "8px 10px", minWidth: 80 }}
            >
              Quay về
            </button>
            {!isPoster && (
              <button
                onClick={handleBooking}
                disabled={saving || !user}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  minWidth: 80,
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Đang đặt..." : "Đặt tour"}
              </button>
            )}
            {isPoster && (
              <>
                <button
                  onClick={handleEdit}
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    minWidth: 80,
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  style={{
                    padding: "8px 10px",
                    background: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? "Đang xoá..." : "Xoá"}
                </button>
              </>
            )}
          </div>
        </aside>
      </div>

      <section
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <h3>Mô tả</h3>
        <p style={{ whiteSpace: "pre-wrap", color: "#333" }}>
          {tour.description || "Không có mô tả"}
        </p>
      </section>
    </main>
  );
}
