import { create } from 'zustand';

// Store này không cần persist, reset mỗi khi reload lại trình duyệt là hợp lý
const useUIStore = create((set) => ({
  isSidebarOpen: true, // Trạng thái thanh menu bên trái
  isGlobalLoading: false, // Trạng thái loading quay vòng tròn giữa màn hình lúc chờ chuyển trang/chạy background

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  setGlobalLoading: (isLoading) => set({ isGlobalLoading: isLoading }),
}));

export default useUIStore;
