"use client";
import { useState } from "react";
import Header from "./Header";
import Image from "next/image";
import Footer from "./Footer";
import "@/app/globals.css";
import SearchPromo from "./SearchPromo";
const tourCards = [
  {
    id: 1,
    badge: "Giảm 2 Triệu/Nhóm 4",
    image:
      "https://product.hstatic.net/200000735165/product/ha_web__1__7679513993774a318b178ec426ba5cef.jpg",
    alt: "Tour Hội An",
    destination: "Tour Hội An - Đà Nẵng 3N2Đ",
    priceOld: "7.000.000đ",
    priceNew: "4.990.000đ",
    departure: "T.Sáu",
    spots: 5,
  },
  {
    id: 2,
    badge: "Giảm 1.111.000đ/kỳ nghỉ 2",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Bai-sao-phu-quoc-tuonglamphotos.jpg/1200px-Bai-sao-phu-quoc-tuonglamphotos.jpg",
    alt: "Tour Hàn Quốc",
    destination: "Hà nội - Sài gòn - Phú quốc 5N4Đ",
    priceOld: "15.500.000đ",
    priceNew: "14.389.000đ",
    departure: "T.Bảy",
    spots: 10,
  },
  {
    id: 3,
    badge: "Giá Tốt Nhất",
    image:
      "https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/012025/z6223362576777_15a21ef00a73b25851a3972d86795475_20250113104122.jpg",
    alt: "Tour Singapore",
    destination: "Hạ long - Nha trang 4N3Đ",
    priceOld: "12.000.000đ",
    priceNew: "10.500.000đ",
    departure: "Hàng ngày",
    spots: 12,
  },
];

export default function Home() {
  const [searchData, setSearchData] = useState({
    destination: "",
    date: "",
    departure: "",
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted:", searchData);
  };

  return (
    <>
      <section className="hero-section">
        <div className="search-promo-box">
          <h1 className="promo-text">
            Hơn 1000+ Tour, Khám Phá Ngay
            <span className="badge">52 khách đặt trong 24h</span>
          </h1>
          <p className="promo-subtext">Giá tốt - Hỗ trợ 24/7 - Khai thác.</p>
          <SearchPromo />
        </div>

        <div className="featured-tour-box">
          <p className="tour-label">TOUR TRUNG QUỐC 6N5Đ</p>
          <p className="tour-name">
            Thành Đô - Cửu Trại Câu - Lạc Sơn Đài Phật - Công Viên Gấu Trúc
          </p>
          <p className="tour-price">
            Giá chỉ từ <span>6.990.000đ</span>/khách
          </p>
        </div>
      </section>

      <section className="info-strip">
        <div className="info-item">
          <i className="fas fa-globe-americas"></i>
          <p>
            <strong>1.000+ tours</strong>
          </p>
          <p>Chất lượng trong và ngoài nước</p>
        </div>
        <div className="info-item">
          <i className="fas fa-star"></i>
          <p>
            <strong>10K+ đánh giá 5 sao</strong>
          </p>
          <p>Từ những khách hàng đã đặt tour</p>
        </div>
        <div className="info-item">
          <i className="fas fa-tag"></i>
          <p>
            <strong>100+ ưu đãi mỗi ngày</strong>
          </p>
          <p>Cho khách đặt sớm, theo nhóm, phút chót</p>
        </div>
      </section>

      <section className="tour-list-section">
        <h2 className="section-title">Tour Ưu Đãi Tốt Nhất Hôm Nay</h2>
        <p className="section-subtitle">Nhanh Tay Đặt Ngay, Để Mai Sẽ Lỡ</p>

        <div className="tour-cards-container">
          {tourCards.map((tour) => (
            <div key={tour.id} className="tour-card">
              <div className="discount-badge">{tour.badge}</div>
              <Image
                src={tour.image}
                alt={tour.alt}
                className="card-image"
                width={500}
                height={500}
              />
              <div className="card-content">
                <p className="tour-destination">{tour.destination}</p>
                <p className="tour-price-old">{tour.priceOld}</p>
                <p className="tour-price-new">
                  {tour.priceNew}
                  <span className="per-guest">/khách</span>
                </p>
                <p className="tour-departure-info">
                  Khởi hành: <strong>{tour.departure}</strong> | Còn{" "}
                  <strong>{tour.spots}</strong> chỗ
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
