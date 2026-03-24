# Lộ trình code chi tiết - Thứ tự code các file
# 🎯 Nguyên tắc code theo thứ tự
Bottom-up approach: Code từ những thứ cốt lõi, độc lập nhất trước, sau đó mới code những thứ phụ thuộc vào chúng. Vì project này bạn làm solo (1 mình), lộ trình đi theo chiều ngang (nghĩa là xong hết hạ tầng, rồi mới sang Layout, và cuối cùng rải code từng trang) là cách đi an toàn và hoàn hảo nhất.

## 📋 GIAI ĐOẠN 1: Cốt lõi & Tiện ích (Core & Utilities)
Không phụ thuộc vào component hay page nào

### 1. src/utils/constants.js
Lý do: Các hằng số dùng xuyên suốt project, cần có trước để các file khác import.
```javascript
// export const API_URL, membershipTypes, packageDurations, paymentMethods...
```

### 2. src/utils/helpers.js
Lý do: Các hàm helper thuần túy, không phụ thuộc gì.
```javascript
// formatDate, formatCurrency, debounce, calculateRemainingDays...
```

### 3. src/utils/formatters.js
Lý do: Format dữ liệu, dùng trong nhiều nơi.
```javascript
// formatPriceVND, formatPhoneNumber, formatDateToVietnamese...
```

### 4. src/utils/menuConfig.js
Lý do: Cấu hình menu cho từng role, dùng trong Sidebar.
```javascript
// export const menus = { owner: [...], manager: [...], ... }
```

## 📋 GIAI ĐOẠN 2: Schemas & Validation
Định nghĩa rules validation trước khi code form

### 5. src/schemas/authSchemas.js
Lý do: Schema cho login/register, dùng ngay khi code Login page.
```javascript
// export const loginSchema, registerSchema, changePasswordSchema
```

### 6. src/schemas/memberSchemas.js
Lý do: Schema cho member management.

### 7. src/schemas/packageSchemas.js
Lý do: Schema cho package management.

### 8. src/schemas/equipmentSchemas.js
Lý do: Schema cho equipment management.

### 9. src/schemas/feedbackSchemas.js
Lý do: Schema cho feedback.

## 📋 GIAI ĐOẠN 3: Store (State Management)
Quản lý global state trước khi code component

### 10. src/store/useAuthStore.js
Lý do: Store quan trọng nhất, quản lý user, token, authentication state.
```javascript
// Zustand store với persist middleware
```

### 11. src/store/useThemeStore.js
Lý do: Store cho theme sáng/tối.

### 12. src/store/useUIStore.js
Lý do: Store cho UI state (sidebar collapsed, modals, loading).

## 📋 GIAI ĐOẠN 4: Services (API Calls)
Code các function gọi API trước khi code hooks. 
💡 TIPS CHO SOLO DEV: Nếu Backend Go chưa viết xong, File này NÊN được dùng để trả về data.json (Mock API) để màn hình Frontend rải xong Layout không trống trơn trắng xoá, tránh bị "block" nhau.

### 13. src/lib/axios.js
Lý do: Cấu hình axios instance, interceptors (nhét Token JWT).

### 14. src/lib/queryClient.js
Lý do: Cấu hình React Query client.

### 15. src/services/authService.js
Lý do: API calls cho authentication.
```javascript
// login, register, logout, getCurrentUser, changePassword
```

### 16. src/services/memberService.js
Lý do: API calls cho member management.
```javascript
// getMembers, createMember, updateMember, deleteMember...
```

### 17. src/services/packageService.js
### 18. src/services/equipmentService.js
### 19. src/services/feedbackService.js
### 20. src/services/reportService.js

## 📋 GIAI ĐOẠN 5: Hooks (React Query)
Code hooks để dùng trong pages

### 21. src/hooks/queries/useAuth.js
Lý do: Query hook cho current user.
```javascript
// export const useCurrentUser = () => useQuery({...})
```

### 22. src/hooks/mutations/useAuthMutations.js
Lý do: Mutation hooks cho auth (login, logout, register).

### 23. src/hooks/queries/useMembers.js
### 24. src/hooks/mutations/useMemberMutations.js
### 25. src/hooks/queries/usePackages.js
### 26. src/hooks/mutations/usePackageMutations.js
### 27. src/hooks/queries/useEquipment.js
### 28. src/hooks/mutations/useEquipmentMutations.js
### 29. src/hooks/queries/useFeedbacks.js
### 30. src/hooks/mutations/useFeedbackMutations.js
### 31. src/hooks/queries/useReports.js

## 📋 GIAI ĐOẠN 6: Components Common (Tái sử dụng)
Code các component dùng chung trước

### 32. src/components/Common/Button.jsx
Lý do: Button tái sử dụng, dùng khắp nơi. Dùng Tailwind compose lại (variants: primary, secondary, danger).

### 33. src/components/Common/Input.jsx
Lý do: Input field với label, lỗi validate Zod.

### 34. src/components/Common/Card.jsx
### 35. src/components/Common/Table.jsx
### 36. src/components/Common/Modal.jsx
### 37. src/components/Common/Loading.jsx
### 38. src/components/Common/Alert.jsx
### 39. src/components/Common/Pagination.jsx

## 📋 GIAI ĐOẠN 7: Forms Components (Tái sử dụng)
Tách các form phức tạp thành component riêng TRƯỚC khi code Layout để sau đó có thể nhét hẳn vào Page và xài luôn.

### 40. src/components/Forms/MemberForm.jsx
Lý do: Form quản lý member tái sử dụng. Sử dụng Zod Member Schema và Mutate của Member Hook ở Giai đoạn trước.

### 41. src/components/Forms/PackageForm.jsx
### 42. src/components/Forms/EquipmentForm.jsx
### 43. src/components/Forms/FeedbackForm.jsx

## 📋 GIAI ĐOẠN 8: Layout Components
Code layout

### 44. src/components/Layout/MainLayout.jsx
Lý do: Layout chính (Kết hợp Sidebar + Header + Outlet của React Router)

### 45. src/components/Layout/Sidebar.jsx
Lý do: Dùng useAuthStore lấy role, render menu từ menuConfig ở Giai đoạn 1.

### 46. src/components/Layout/Header.jsx
Lý do: Hiển thị user info, logout button, theme toggle

### 47. src/components/Layout/Footer.jsx

## 📋 GIAI ĐOẠN 9: Dashboard Các Tiểu Tự (Components)
Code dashboard components nhỏ

### 48. src/components/Dashboard/StatsCard.jsx
### 49. src/components/Dashboard/RecentActivities.jsx
### 50. src/components/Dashboard/UpcomingSchedules.jsx
### 51. src/components/Charts/RevenueChart.jsx
### 52. src/components/Charts/MemberStatsChart.jsx
### 53. src/components/Charts/PerformanceChart.jsx

## 📋 GIAI ĐOẠN 10: Routes & Guards
Code routing để bảo vệ và điều hướng

### 54. src/routes/PrivateRoute.jsx
Lý do: Đẩy ra trang Auth nếu không có JWT Token trong useAuthStore.

### 55. src/routes/RoleBasedRoute.jsx
Lý do: Chặn Member vào link /owner/dashboard bằng cách redirect.

### 56. src/routes/index.jsx

## 📋 GIAI ĐOẠN 11: Final Integration (Dựng hệ thống khung)
Khởi chạy bộ trục xương sống của ứng dụng, để có thể bật được trình duyệt lên cho các Giai đoạn kế tiếp nhảy vào Code là F5 thấy màn hình ngay.

### 57. src/App.jsx
Lý do: Tổng hợp Router, Routes. 
```javascript
// BrowserRouter + Routes + Route + PrivateRoute + RoleBasedRoute
```

### 58. src/main.jsx
Lý do: Khởi động React DOM, bọc ứng dụng vào <QueryClientProvider> từ GĐ 4 và Render App.

## 📋 GIAI ĐOẠN 12: Pages - Authentication
Trang đầu tiên cần chạy khi khởi chạy App thật sự

### 59. src/pages/Login/Login.jsx
Lý do: Trang đăng nhập. Dùng React Hook Form + AuthSchemas + useLogin mutation.

## 📋 GIAI ĐOẠN 13: Pages - Owner (Chủ phòng tập)
Làm rải rác từng Flow hoàn chỉnh

### 60. src/pages/Owner/OwnerDashboard.jsx
Lý do: Bọc 3 cái Chart và Stats component vào Layout.

### 61. src/pages/Owner/MemberManagement/MemberList.jsx
Lý do: Đẩy Table Common vào, dùng Query useMembers.

### 62. src/pages/Owner/MemberManagement/MemberForm.jsx
Lý do: Gọi MemberForm.jsx tái sử dụng từ Giai Đoạn 7. Không cần code lại.

### 63. src/pages/Owner/MemberManagement/MemberDetail.jsx
### 64. src/pages/Owner/PackageManagement/PackageList.jsx
### 65. src/pages/Owner/PackageManagement/PackageForm.jsx
### 66. src/pages/Owner/EquipmentManagement/EquipmentList.jsx
### 67. src/pages/Owner/EquipmentManagement/EquipmentForm.jsx
### 68. src/pages/Owner/StaffManagement/StaffList.jsx
### 69. src/pages/Owner/StaffManagement/StaffForm.jsx
### 70. src/pages/Owner/RoomManagement/RoomList.jsx
### 71. src/pages/Owner/FeedbackManagement/FeedbackList.jsx
### 72. src/pages/Owner/Reports/RevenueReport.jsx

## 📋 GIAI ĐOẠN 14: Pages - Manager (Nhân viên quản lý)
Tương tự Owner, xào lại các component bảng biểu và forms nhưng giới hạn quyền.

### 73. src/pages/Manager/ManagerDashboard.jsx
### 74. src/pages/Manager/MemberManagement/MemberList.jsx
### 75. src/pages/Manager/MemberManagement/RegisterMember.jsx
### 76. src/pages/Manager/MemberManagement/RenewPackage.jsx
### 77. src/pages/Manager/FeedbackManagement/FeedbackList.jsx

## 📋 GIAI ĐOẠN 15: Pages - Trainer (Huấn luyện viên)
Code trainer pages

### 78. src/pages/Trainer/TrainerDashboard.jsx
### 79. src/pages/Trainer/StudentManagement/StudentList.jsx
### 80. src/pages/Trainer/StudentManagement/TrackProgress.jsx
### 81. src/pages/Trainer/Schedule/ScheduleList.jsx
### 82. src/pages/Trainer/Evaluation/EvaluationForm.jsx

## 📋 GIAI ĐOẠN 16: Pages - Member (Hội viên)
Code giao diện dành cho app mobile - web responsive.

### 83. src/pages/Member/MemberDashboard.jsx
### 84. src/pages/Member/MyPackage/PackageInfo.jsx
### 85. src/pages/Member/MyPackage/TrainingHistory.jsx
### 86. src/pages/Member/RenewPackage/RenewPackage.jsx
### 87. src/pages/Member/Feedback/SendFeedback.jsx
### 88. src/pages/Member/Profile/ProfileInfo.jsx
### 89. src/pages/Member/Profile/EditProfile.jsx

## 📊 Tổng kết thứ tự code mới (Đã tối ưu cho Solo Dev)
| Giai đoạn | Số file | Nội dung |
|---|---|---|
| 1. Core & Utils | 4 | constants, helpers, formatters, menuConfig |
| 2. Schemas | 5 | auth, member, package, equipment, feedback |
| 3. Store | 3 | auth, theme, UI stores |
| 4. Services | 8 | axios, queryClient, auth, member... (Kèm Mock API) |
| 5. Hooks | 11 | queries (5) + mutations (6) |
| 6. Common UI | 8 | Button, Input, Card, Table, Modal, Loading... |
| 7. Form UI | 4 | Tách MemberForm, PackageForm, EquipmentForm sớm |
| 8. Layout UI | 4 | MainLayout, Sidebar, Header, Footer |
| 9. Dash Component 6 | StatsCard, RecentActivities, UpcomingSchedules, 3 Charts |
| 10. Routes | 3 | PrivateRoute, RoleBasedRoute, index |
| 11. Integration | 2 | Mở App.jsx, chạy main.jsx Render ngay ra giao diện |
| 12. Login Page | 1 | Màn hình đăng nhập đầu tiên hiển thị |
| 13. Owner Pages | 13 | Lắp ghép logic cho Chủ phòng |
| 14. Manager Pages 5 | Lắp ghép logic cho Quản Lý |
| 15. Trainer Pages 5 | Lắp ghép logic cho Huấn Luyện Viên |
| 16. Member Pages  7 | Giao diện Hội Viên. Mảnh cuối cùng của hệ thống. |
