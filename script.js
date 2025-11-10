// Bước 1: Lấy các phần tử cần thiết từ HTML (theo cấu trúc mẫu mới)
const heroSearchForm = document.querySelector(".hero-search-form"); // Lấy Form tìm kiếm
const destinationInput = document.querySelector(".destination-input"); // Ô "Bạn muốn đi đâu?"
const dateInput = document.querySelector(".date-input"); // Ô "Ngày khởi hành"
const departureInput = document.querySelector(".departure-input"); // Ô "Khởi hành từ"

// --- HÀM HỖ TRỢ HIỂN THỊ LỖI (Để người dùng biết họ sai ở đâu) ---
function displayError(inputElement, message) {
  // Chúng ta sẽ thêm một class CSS để tô màu đỏ khung nhập liệu
  inputElement.classList.add("input-error");

  // (Trong dự án thực tế, bạn sẽ tạo một thẻ <div> nhỏ để hiện thông báo lỗi bên dưới ô input)
  alert(`Lỗi tại [${inputElement.placeholder}]: ${message}`);
}

// --- HÀM CHÍNH XỬ LÝ SỰ KIỆN TÌM KIẾM ---
function handleHeroSearch(event) {
  // 1. Ngăn trình duyệt tải lại trang khi submit form
  event.preventDefault();

  // 2. Thiết lập trạng thái ban đầu: Không có lỗi
  let isValid = true;

  // --- 3. BẮT ĐẦU LOGIC KIỂM TRA (VALIDATION) ---

  // A. Lấy giá trị đã nhập và loại bỏ khoảng trắng dư thừa
  const destination = destinationInput.value.trim();
  const departureDate = dateInput.value;
  const departureFrom = departureInput.value.trim();

  // Reset lại style lỗi trước khi kiểm tra lại
  destinationInput.classList.remove("input-error");
  dateInput.classList.remove("input-error");
  departureInput.classList.remove("input-error");

  // LOGIC 1: Kiểm tra Điểm đến (BẮT BUỘC phải nhập)
  if (destination === "") {
    displayError(
      destinationInput,
      "Bạn phải nhập điểm đến để chúng tôi tìm tour!"
    );
    isValid = false;
  }

  // LOGIC 2: Kiểm tra Ngày khởi hành (BẮT BUỘC phải nhập)
  // Lưu ý: Input type="date" thường trả về chuỗi rỗng nếu không chọn gì
  if (departureDate === "" || departureDate === "Ngày khởi hành linh hoạt") {
    displayError(dateInput, "Vui lòng chọn ngày khởi hành hoặc nhập từ khóa!");
    isValid = false;
  }

  // LOGIC 3: Kiểm tra Khởi hành từ (Nên kiểm tra, nhưng mẫu này không bắt buộc)
  // Nếu bạn muốn bắt buộc, hãy thêm code kiểm tra tương tự như trên.

  // --- 4. LOGIC XỬ LÝ CUỐI CÙNG ---
  if (isValid) {
    // Dữ liệu hợp lệ! Sẵn sàng để gửi đi.

    // Mô phỏng: Chuẩn bị dữ liệu để gửi lên server
    const searchData = {
      destination: destination,
      date: departureDate,
      departure: departureFrom || "Không xác định", // Gán giá trị mặc định nếu người dùng bỏ trống
    };

    // *************** PHẦN QUAN TRỌNG ***************
    // Trong dự án thực tế, tại đây bạn sẽ dùng Fetch API hoặc Axios
    // để gửi object searchData này lên máy chủ Backend (Laravel/Node.js)
    // để truy vấn Cơ sở dữ liệu.

    console.log("Dữ liệu tìm kiếm hợp lệ:", searchData);
    alert(
      `Tìm kiếm thành công! Đang chuyển đến trang kết quả tour tới ${destination} khởi hành ngày ${departureDate}.`
    );

    // Ví dụ thực tế: window.location.href = `/search-results?dest=${destination}&date=${departureDate}`;
  } else {
    console.warn("Tìm kiếm bị hủy do dữ liệu không hợp lệ.");
  }
}

// Bước 5: Gắn hàm xử lý vào sự kiện submit của form
if (heroSearchForm) {
  heroSearchForm.addEventListener("submit", handleHeroSearch);
}
// --- LOGIC TÁI SỬ DỤNG HEADER/FOOTER ---

function includeHTML() {
  const elements = document.querySelectorAll("[data-include]");
  elements.forEach((el) => {
    const file = el.getAttribute("data-include");
    if (file) {
      // Dùng Fetch API để lấy nội dung từ file
      fetch(file)
        .then((response) => {
          if (response.ok) return response.text();
          throw new Error("Không thể tải nội dung: " + file);
        })
        .then((html) => {
          el.innerHTML = html; // Chèn nội dung HTML đã tải vào vị trí hiện tại
          el.removeAttribute("data-include"); // Xóa thuộc tính để tránh lặp lại

          // Sau khi footer được tải, có thể cần áp dụng một số CSS đặc biệt
        })
        .catch((error) => {
          console.error("Lỗi khi tải file:", error);
        });
    }
  });
}

// Gọi hàm ngay khi script được tải
includeHTML();
// --- LOGIC XỬ LÝ FORM ĐĂNG KÝ (register.html) ---

// Chờ cho toàn bộ DOM (cấu trúc HTML) được tải xong
document.addEventListener("DOMContentLoaded", () => {
  // 1. Lấy Form Đăng ký bằng ID
  const registerForm = document.getElementById("register-form");

  // Kiểm tra xem chúng ta có đang ở trang Đăng ký không
  if (registerForm) {
    // 2. Bắt sự kiện khi người dùng bấm nút Đăng ký
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Ngăn chặn Form Submit mặc định (tải lại trang)

      // Lấy dữ liệu từ các trường nhập liệu
      const full_name = document.getElementById("full_name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirm_password =
        document.getElementById("confirm_password").value;

      // **Quan trọng:** Đảm bảo Backend của bạn đang chạy ở http://localhost:5000
      const API_URL = "http://localhost:5000/api/register";

      try {
        // 3. Gửi yêu cầu POST đến API Backend
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Báo cho server biết đây là dữ liệu JSON
          },
          body: JSON.stringify({
            // Chuyển dữ liệu JavaScript sang chuỗi JSON
            full_name,
            email,
            password,
            confirm_password, // Backend sẽ kiểm tra trường này
          }),
        });

        // Chuyển phản hồi (Response) thành đối tượng JSON
        const data = await response.json();

        // 4. Xử lý Phản hồi từ Server
        if (response.ok) {
          // Đăng ký thành công (Server trả về Status 201)
          alert("Đăng ký thành công! Bạn có thể Đăng nhập ngay bây giờ.");

          // Chuyển hướng người dùng đến trang Đăng nhập
          window.location.href = "login.html";
        } else {
          // Đăng ký thất bại (Lỗi Validation hoặc Email đã tồn tại)
          // Hiển thị thông báo lỗi từ Backend
          alert(`Đăng ký thất bại: ${data.msg || "Kiểm tra lại dữ liệu."}`);
        }
      } catch (error) {
        // Xử lý lỗi kết nối mạng hoặc lỗi server nghiêm trọng
        console.error("Lỗi kết nối:", error);
        alert("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      }
    });
  }
});
