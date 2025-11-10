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
