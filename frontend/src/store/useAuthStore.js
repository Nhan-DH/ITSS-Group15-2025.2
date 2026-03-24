import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Lưu thông tin cơ bản: { id, name, role, email... }
      token: null, // JWT Token dùng để gọi API
      isAuthenticated: false, // Trạng thái login

      // Gọi hàm này khi User login thành công
      login: (userData, token) => set({ 
        user: userData, 
        token, 
        isAuthenticated: true 
      }),

      // Xóa toàn bộ dữ liệu khi Logout
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),

      // Cập nhật 1 phần thông tin User (VD: khi user đổi tên/avatar)
      updateUser: (newData) => set((state) => ({ 
        user: state.user ? { ...state.user, ...newData } : null 
      })),
    }),
    {
      name: 'auth-storage', // Key lưu trên localStorage
    }
  )
);

export default useAuthStore;
