"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchPromo() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [departure, setDeparture] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("search", destination);
    if (date) params.set("date", date);
    if (departure) params.set("departure", departure);
    const qs = params.toString() ? `?${params.toString()}` : "";
    router.push(`/tours${qs}`);
  };

  return (
    <section className="search-promo-box">
      <h1 className="promo-text">
        Hơn 1000+ Tour, Khám Phá Ngay{" "}
        <span className="badge">52 khách đặt trong 24h</span>
      </h1>
      <p className="promo-subtext">Giá tốt - Hỗ trợ 24/7 - Khai thác.</p>

      <form className="hero-search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Bạn muốn đi đâu?"
          className="search-input destination-input"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <div className="search-group">
          <input
            type="text"
            placeholder="Ngày khởi hành (YYYY-MM-DD)"
            className="search-input date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Khởi hành từ"
            className="search-input departure-input"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          />
          <button type="submit" className="search-btn">
            Tìm
          </button>
        </div>
      </form>
    </section>
  );
}
