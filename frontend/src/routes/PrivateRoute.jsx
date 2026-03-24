import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';

const PrivateRoute = () => {
  const { token, user } = useAuthStore();
  const location = useLocation();

  // Kiểm tra xem đã Login chưa
  if (!token || !user) {
    // Nếu chưa đăng nhập, đá về trang Login. 
    // Ghi nhớ URL hiện tại vào state để login xong chuyển hướng lại đúng chỗ thao tác dở
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cho phép đi tiếp vào các Route con (Outlet)
  return <Outlet />;
};

export default PrivateRoute;
