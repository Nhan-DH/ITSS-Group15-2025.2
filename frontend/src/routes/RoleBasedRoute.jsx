import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';

// Bảo vệ Route dựa trên Role của tài khoản
// Truyền prop allowedRoles: array (vd: ['owner', 'manager'])
const RoleBasedRoute = ({ allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu Role của user không được khai báo trong allowedRoles -> Chặn đứng
  if (!allowedRoles.includes(user.role)) {
    // Tự động đẩy về màn hình gốc của chính User đó dựa theo role
    switch(user.role) {
      case 'owner': return <Navigate to="/owner/dashboard" replace />;
      case 'manager': return <Navigate to="/manager/dashboard" replace />;
      case 'trainer': return <Navigate to="/trainer/dashboard" replace />;
      default: return <Navigate to="/member/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default RoleBasedRoute;
