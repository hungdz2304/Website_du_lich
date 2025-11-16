"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/app/globals.css";
// ...existing code...

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [q, setQ] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const qs = q ? `?search=${encodeURIComponent(q)}` : "";
    router.push(`/tours${qs}`);
  };

  useEffect(() => {
    try {
      const raw =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      setUser(null);
    }
    function onStorage(e) {
      try {
        const raw =
          localStorage.getItem("user") || sessionStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch (err) {
        setUser(null);
      }
    }

    function onAuthChanged(e) {
      // event can carry { reload: true } to force full page reload
      const reload = e && e.detail && e.detail.reload;
      try {
        const raw =
          localStorage.getItem("user") || sessionStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch (err) {
        setUser(null);
      }
      if (reload) {
        window.location.reload();
      }
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("authChanged", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo">
          <Link href="/" className="link">
            iTOUR.COM
          </Link>
        </div>
        <nav className="main-nav">
          <Link href="/tours">Tour</Link>
          <Link href="/bills">Bill</Link>
          <form
            onSubmit={handleSearchSubmit}
            className="nav-search-form"
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginLeft: 12,
            }}
          >
            <input
              aria-label="Search tours"
              className="nav-search-input"
              placeholder="Tìm tour..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{
                padding: "4px 8px",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              style={{ marginLeft: 6, padding: "6px 10px" }}
            >
              Tìm
            </button>
          </form>
        </nav>

        <div className="auth-buttons">
          {user ? (
            <>
              <span className="user-name">
                Hi, {user.username || user.full_name || "User"}
              </span>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/register" className="btn btn-register">
                Đăng ký
              </a>
              <a href="/login" className="btn btn-login">
                Đăng nhập
              </a>
            </>
          )}
        </div>

        <a
          href="https://github.com/hungdz2304/Website_du_lich"
          target="_blank"
          className="hotline"
        >
          Đồ Án CNPM NHÓM 8
        </a>
      </div>
    </header>
  );
}
