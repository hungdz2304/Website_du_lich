import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Trang Chủ Đặt Tour Du Lịch - Mô phỏng",
  description: "Trang đặt tour du lịch mô phỏng - hỗ trợ 24/7, giá tốt",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Header />
        <main>
          {children}
        </main>
        
      <Footer />
      </body>
    </html>
  );
}