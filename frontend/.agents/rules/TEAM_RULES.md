# Tiêu chuẩn Kỹ thuật và Quy tắc Làm việc Nhóm

## 1. Tư duy Senior Engineering (Senior Mindset)
- **Modular & Clean Architecture:** Backend Go phải tuân thủ Clean Architecture (Handler -> Usecase -> Repository) hoặc kiến trúc phân lớp vững chắc. Frontend React được tổ chức theo module-driven (thư mục quản lý theo Feature: Auth, GymClass, Member).
- **Graceful Error Handling:** Go bắt buộc xử lý lỗi tường minh, không dùng `panic` trừ những trường hợp lỗi lúc khởi tạo không thể phục hồi. Frontend phải bọc Error Boundary, tuyệt đối không để giao diện lỗi màn hình trắng trống rỗng.
- **Zero Silent Failures:** Log lỗi chi tiết ở Backend (ví dụ: lỗi thanh toán, cập nhật trạng thái thiết bị). Giao tiếp lỗi qua HTTP status codes chuẩn và gửi error message thân thiện về Frontend.
- **Performance First:** Tối ưu hóa render React, dùng các hooks phân tách rõ ràng. Backend logic tối ưu các câu truy vấn thống kê lớn (Báo cáo doanh thu) để không tạo "cổ chai" database.

## 2. Git Workflow & Branching Strategy
- **Nhánh chính:** `main` (Production) và `develop` (Staging). Không ai được phép push trực tiếp lên các nhánh này.
- **Nhánh tính năng:** Tuân thủ chuẩn `feature/ticket-name`, `bugfix/ticket-name`.
- **Commit Messages:** Ghi theo chuẩn Conventional Commits Tiếng Anh (vd: `feat(api): add member registration logic`, `fix(ui): resolve overflow on mobile dashboard`).
- **PR Review Checklist (Bắt buộc):**
  - Đã chạy linter (`golangci-lint` bảo mẫu Go, `eslint` cho React) chưa?
  - Unit tests có cover logic nghiệp vụ gia hạn gói tập/toán toán tiền chưa?
  - Bắt buộc phải có 1 approval từ Senior hoặc Tech Lead trước khi được phép merge.

## 3. Tiêu chuẩn Mã nguồn (Code Standards)
- **Backend (Go Language):**
  - Tuân thủ Effective Go (Style chuẩn của Go).
  - Tích hợp `golangci-lint`, check lỗi tiềm ẩn, dead code, v.v.
  - Phải validate kỹ payload Request từ Client trước khi đẩy xuống DB.
- **Frontend (React JSX, TailwindCSS, Vite):**
  - Sử dụng Vite kết hợp Alias Absolute Path (`@/*`).
  - Sử dụng TailwindCSS v4 (Engine mới, cấu hình bằng biến CSS nội bộ). Phân tách UI (Button, Card, Form) thành các Presentational Components.
  - Core Stack: Tuân thủ tuyệt đối việc dùng `zustand` cho Global State, `React Query` cho Data Fetching và `react-hook-form` + `zod` để Validate dữ liệu.

## 4. API Contract First
- **Thiết kế trước - Code sau:** Team Backend và Frontend phải ngồi lại thống nhất chuẩn payload RESTful API (Response format cho Thiết bị, Gói tập).
- Dùng Swagger / OpenAPI định nghĩa Contract như một "Single Source of Truth". Nếu Backend thay đổi, báo cho Frontend ngay lập tức.
