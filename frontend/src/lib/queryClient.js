import { QueryClient } from '@tanstack/react-query';

// Cấu hình Global Options cho React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Hạn chế việc tự động fetch lại (refetch) liên tục khi tab inactive -> active
      refetchOnWindowFocus: false,
      // Thời gian cache data trước khi bị coi là cũ (Stale) - 5 phút (300.000 ms)
      staleTime: 5 * 60 * 1000,
      // Thời gian rác bị dọn khỏi bộ nhớ cache (Garbage Collection) - 10 phút
      gcTime: 10 * 60 * 1000,
      // Số lần retry mặc định nếu gọi API lỗi (1 lần)
      retry: 1, 
    },
    mutations: {
      // Logic xử lý chung khi Cập nhật (Mutation) lỗi có thể bỏ vào đây
      retry: 0,
    }
  },
});
