import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import useAuthStore from '@/store/useAuthStore';

// Hook để lấy thông tin user hiện tại (ví dụ reload lại trang thì chạy lại lấy data mới nhất từ DB)
export const useCurrentUser = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    // Chỉ gọi API này khi đã có token trong Zustand Store
    enabled: !!token, 
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};
