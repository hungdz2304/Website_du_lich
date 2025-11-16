"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ToursPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // read user from storage
    try {
      const raw =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch (e) {
      setUser(null);
    }

    // fetch tours when page loads or when query string changes
    fetchTours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  async function fetchTours() {
    try {
      // build query string from URL search params
      const params = new URLSearchParams();
      const q = searchParams?.get("search");
      const departure = searchParams?.get("departure");
      const date = searchParams?.get("date");
      if (q) params.set("search", q);
      if (departure) params.set("departure", departure);
      if (date) params.set("date", date);
      const url = `${BASE_URL}/tours${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        setError(`Failed to load tours: ${res.status} ${res.statusText}`);
        setLoading(false);
        return;
      }
      const data = await res.json();
      // normalize snake_case to camelCase for image_url
      const normalized = (Array.isArray(data) ? data : []).map((t) => ({
        ...t,
        imageUrl: t.imageUrl || t.image_url,
      }));
      setTours(normalized);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <main style={{ padding: 24 }}>
        <p>Loading...</p>
      </main>
    );

  const isPoster = user && user.role === "poster";
  const q = searchParams?.get("search");

  return (
    <main style={{ padding: 24 }}>
      {isPoster ? (
        <button>
          <Link href="tours/create">Create new tour</Link>
        </button>
      ) : (
        <div
          style={{
            background: "#fff3cd",
            border: "1px solid #ffc107",
            padding: 12,
            marginBottom: 16,
            borderRadius: 4,
          }}
        >
          <p style={{ margin: 0, color: "#856404" }}>
            📝 Only <strong>poster</strong> users can create/edit tours.
            {user
              ? " Please contact admin to upgrade your account."
              : ' Please <a href="/login">login</a> as a poster.'}
          </p>
        </div>
      )}

      <h1 style={{ marginBottom: 16 }}>Tour Ưu Đãi</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* If searching, show a header with the query and count. Render full card grid when there are results. */}
      {q && tours.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <p>
            Kết quả tìm kiếm cho <strong>"{q}"</strong> ({tours.length})
          </p>
        </div>
      )}

      {q && tours.length === 0 ? (
        <div style={{ padding: 24, color: "#777" }}>
          Không tìm thấy kết quả cho "{q}" trên web.
        </div>
      ) : tours.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {tours.map((tour) => (
            <article
              key={tour.id}
              style={{
                background: "#fff",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                position: "relative",
              }}
            >
              <div style={{ position: "relative" }}>
                {tour.imageUrl ? (
                  <Image
                    src={tour.imageUrl}
                    alt={tour.name || "tour image"}
                    width={280}
                    height={180}
                    style={{ width: "100%", height: 180, objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f2f2f2",
                      color: "#888",
                    }}
                  >
                    No image
                  </div>
                )}
              </div>

              <div style={{ padding: 16 }}>
                <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>
                  <Link href={`tours/detail/${tour.id}`}>{tour.name}</Link>
                </h2>
                <p style={{ margin: "0 0 12px", color: "#555", minHeight: 40 }}>
                  {tour.description || "Không có mô tả"}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ color: "#ff6600", fontWeight: 700 }}>
                      {tour.price != null
                        ? `${Number(tour.price).toLocaleString("vi-VN")}₫`
                        : "Liên hệ"}
                    </div>
                    <div style={{ fontSize: 12, color: "#777" }}>
                      Khởi hành: {tour.departure || "Tùy chọn"}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#777" }}>Còn</div>
                    <div style={{ fontWeight: 700 }}>{tour.spots ?? 0}</div>
                  </div>
                </div>

                {isPoster && (
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <Link
                      href={`tours/edit/${tour.id}`}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "8px",
                        background: "#007bff",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: 4,
                      }}
                    >
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p>Không có tour nào.</p>
      )}
    </main>
  );
}
