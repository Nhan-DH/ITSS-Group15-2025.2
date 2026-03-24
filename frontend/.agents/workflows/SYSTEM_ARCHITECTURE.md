# Architecture & Tech Stack (Gym Management System)

Với quy mô hệ thống phục vụ phòng Gym (đòi hỏi xử lý nhanh, bảo mật thanh toán, trải nghiệm dashboard mượt). Mô hình Client-Server phân cực rõ ràng được ứng dụng.

## 1. Lớp Backend (Service Level)
- **Language & Runtime:** Go (Golang) được chọn nhờ khả năng biên dịch mạnh mẽ, cấp phát ít memory và routing tốc độ cao, hoàn toàn áp ứng được traffic đông đảo cùng lúc.
- **Software Architecture:** Áp dụng Domain-Driven Design (DDD) cơ bản hoặc Clean Architecture:
  - `Delivery / Controller:` Cổng tiếp nhận HTTP Request.
  - `Usecase / Service:` Chỉ chứa pure logic nghiệp vụ kinh doanh phòng Gym (Gia hạn gói, check hạn sử dụng, tính hoa hồng cho PT huấn luyện viên).
  - `Repository:` Tầng giao tiếp cơ sở dữ liệu.
- **Database:** PostgreSQL/MySQL chuẩn RDBMS nhằm đảm bảo tính Transactional cho số tiền đóng phí của thành viên gym.

## 2. Lớp Frontend (Presentation Level)
- **Core Library:** React JSX - Build Tool bằng Vite.
- **Tạo kiểu giao diện:** Hướng Utility-first với TailwindCSS v4 (Không cần `tailwind.config.js` do tích hợp thẳng vào engine Vite).
- **Data Hook & State:** Sử dụng chính thức `@tanstack/react-query` nhằm xử lý Data Fetching tự động cập nhật Cache, kết hợp `zustand` quản lý Auth/Theme State.
- **Form Validation:** Sử dụng `react-hook-form` kết hợp `zod` schemas để bắt lỗi dữ liệu đầu vào chuẩn xác.
- **Security & Route Guard:** Bảo vệ component (PublicRoute / PrivateRoute) rõ ràng. Có phân nhánh rõ người dùng (Member App vs Admin Dashboard).

## 3. Security & Hosting
- JWT Token sử dụng để chứng thực phiên tải (Login).
- Các API update xoá phải rà soát qua Authentication Middleware của Golang.
- Docker hóa frontend client static files cùng Go api backend sang Docker Network để cách ly và dễ deploy lên bất kỳ Cloud Provider (AWS, Vercel/Render, Digital Ocean).
