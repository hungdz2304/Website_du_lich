"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchBills = async () => {
      try {
        const res = await fetch(`${BASE_URL}/bills`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load bills");

        setBills(json);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    };

    fetchBills();
  }, [router]);

  if (loading) return <p className="p-4">Đang tải...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hóa đơn của bạn</h1>

      {bills.length === 0 && <p>Chưa có hóa đơn nào.</p>}

      <div className="space-y-4">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="p-4 border rounded-md shadow-sm bg-white flex gap-4"
          >
            {/* Tour Image */}
            {bill.tour?.image && (
              <Image
                src={bill.tour.image}
                className="w-32 h-20 object-cover rounded"
                alt="Tour"
                width={200}
                height={120}
              />
            )}

            {/* Details */}
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{bill.tour?.name}</h2>

              <p className="text-sm text-gray-600">Số lượng: {bill.quantity}</p>

              <p className="text-sm text-gray-600">
                Tổng tiền: {bill.totalPrice.toLocaleString()} VND
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Ngày đặt: {new Date(bill.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
