# CI/CD Standards & Rules 

Tài liệu này định nghĩa các quy tắc cốt lõi về Continuous Integration và Continuous Deployment (CI/CD) cho monorepo/dự án Hệ thống Quản lý phòng tập Gym.

## 1. PR Merge Gates

Tất cả các Pull Request (PR) hướng vào nhánh `main` hoặc `develop` bắt buộc phải vượt qua các step kiểm tra tự động tước khi merge. Nguyên tắc là Zero Exception.
- **Go Backend Checks:**
  - Qua bài kiểm tra `go fmt` và `golangci-lint` (không tồn tại high-severity warnings).
  - Pass 100% Go test hiện hành, có scan báo cáo tỷ lệ coverage tối thiểu (VD: > 70%).
- **React Frontend Checks:**
  - Pass linter `eslint` và code formatter `prettier`.
  - Vượt qua vòng build production bằng Vite (`npm run build`). Đảm bảo không lỗi type/build.

## 2. Monorepo / Path Filtering Rule
Để hệ thống đánh giá CI Github Actions nhanh và tối ưu chi phí:
- **Frontend changes:** Thay đổi ở thư mục giao diện sẽ chỉ trigger `frontend-pipeline`.
- **Backend changes:** Sửa logic Golang chỉ trigger `backend-pipeline`.
- Chỉ thay đổi các cấu hình lõi (docker files, github workflow file) mới kích hoạt song song toàn bộ pipeline.

## 3. Quản lý Môi trường & Config Secrets
- Không bao giờ commit `.env` hoặc access tokens lệ thuộc. Chỉ push `.env.example` lên repo.
- GitHub Actions sử dụng GitHub Secrets hoặc HashiCorp Vault để lấy biến môi trường trong lúc tiến hành deploy.

## 4. Versioning & Tagging
Tuân thủ Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`
- **MAJOR:** Tính năng lớn phá vỡ cấu trúc API cũ hoặc đổi DB schema tổng thể.
- **MINOR:** Thêm trang thông báo, tính năng báo cáo Excel (vẫn tương thích backward).
- **PATCH:** Sửa bug css Tailwind, hoặc fix null pointer ở Go backend.
