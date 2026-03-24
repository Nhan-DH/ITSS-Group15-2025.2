# Quy trình Sprint & Các Cột mốc Dự án (Hệ thống quản lý phòng Gym)

## Phase 1: Nền tảng, Database & API Contract (Bootstrapping)
- **Backend (Go):** Thiết kế Database Schema hoàn chỉnh quản lý phòng tập, thiết bị, nhân sự, thẻ hội viên, khóa tập. Cung cấp API Mock / Swagger Specs đầu tiên.
- **Frontend (React, Vite):** Khởi tạo khung project với định tuyến cấu trúc Alias chuẩn (`@/*`). *Lưu ý quan trọng: Team dev tiến hành tuân thủ tuyệt đối tiến độ Frontend dựa trên "Lộ trình 16 giai đoạn" trong file `.agents/schedules/work-schedules.md`*.
- **Dependencies (Điểm nghẽn):** Team phải chốt API Contract. Nếu API GoLang chưa sẵn sàng, Frontend bắt buộc thiết lập Mock Data ngay trong Services layer.

## Phase 2: Core Logic & Tích hợp Quản lý
- **Backend:** Thực thi nghiệp vụ đăng ký thành viên, cấp mã hội viên tự động, check logic thời hạn gia hạn gói tập. Quản lý danh sách thiết bị và lưu lịch bảo hành.
- **Frontend:** Thiết kế Dashboard form quản lý toàn diện (Cấu hình thêm thành viên, hiển thị ảnh). Chuyển hoàn toàn từ Mock data sang tích hợp Go REST API thật.
- **QA / Test:** Viết các Unit tests về phần tiền tệ và thời gian (Expire date của gói tập) để tránh sai lệch logic.

## Phase 3: Hệ thống Báo Cáo Thống Kê & Phản Hồi
- **Backend:** Query kết hợp các bảng phục vụ tính Tống kê doanh thu theo (Ngày/Tháng/Quý/Năm). Cung cấp API lưu nhận xét chất lượng đội ngũ HLV & Thiết bị từ hội viên đăng nhập.
- **Frontend:** Implement Chart Libraries (Recharts/Chart.js) cho các Biểu đồ Báo cáo sinh động. Phân luồng đăng nhập (Member thấy lịch sử của mình, Admin thấy tổng quan phòng tập).
- **Review:** Focus tối ưu render UI chậm do biểu đồ và tối ưu index Go/DB query.

## Phase 4: Đánh Giá, UAT & Tinh Chỉnh Sản Lưu Trữ (Polish & Dockerize)
- **UX/UI Check:** Test trải nghiệm của giao diện Quản lý Gym trên điện thoại (Responsive CSS Tailwind), đảm bảo giao diện thân thiện với Huấn Luyện Viên ngoài sân tập.
- **DevOps:** Đóng gói Backend thành các Multi-stage Go Docker images siêu nhỏ, đẩy tĩnh Frontend React build files vào Nginx container chuẩn bị cho triển khai cloud.
- Mở quy trình Beta testing (UAT nội bộ) thu nhập lỗi của logic gia hạn đăng ký.
