import { ROLES } from "./constants";

export const menus = {
  [ROLES.OWNER]: [
    { title: "Tổng quan", path: "/owner/dashboard", icon: "LayoutDashboard" },
    { title: "Phòng tập", path: "/owner/rooms", icon: "Home" },
    { title: "Nhân sự", path: "/owner/staffs", icon: "Users" },
    { title: "Hội viên", path: "/owner/members", icon: "UserCheck" },
    { title: "Gói tập", path: "/owner/packages", icon: "Package" },
    { title: "Thiết bị", path: "/owner/equipment", icon: "Dumbbell" },
    { title: "Phản hồi", path: "/owner/feedbacks", icon: "MessageSquare" },
    { title: "Báo cáo", path: "/owner/reports", icon: "BarChartBig" },
  ],
  [ROLES.MANAGER]: [
    { title: "Tổng quan", path: "/manager/dashboard", icon: "LayoutDashboard" },
    { title: "Hội viên", path: "/manager/members", icon: "Users" },
    { title: "Gói tập", path: "/manager/packages", icon: "Package" },
    { title: "Phản hồi", path: "/manager/feedbacks", icon: "MessageSquare" },
  ],
  [ROLES.TRAINER]: [
    { title: "Tổng quan", path: "/trainer/dashboard", icon: "LayoutDashboard" },
    { title: "Lịch dạy", path: "/trainer/schedule", icon: "CalendarCheck" },
    { title: "Học viên", path: "/trainer/students", icon: "Users" },
    { title: "Đánh giá", path: "/trainer/evaluation", icon: "CheckSquare" },
  ],
  [ROLES.MEMBER]: [
    { title: "Tổng quan", path: "/member/dashboard", icon: "LayoutDashboard" },
    { title: "Gói tập của tôi", path: "/member/my-package", icon: "Package" },
    { title: "Gia hạn", path: "/member/renew", icon: "CreditCard" },
    { title: "Gửi phản hồi", path: "/member/feedback", icon: "MessageCircle" },
    { title: "Hồ sơ cá nhân", path: "/member/profile", icon: "User" },
  ],
};
