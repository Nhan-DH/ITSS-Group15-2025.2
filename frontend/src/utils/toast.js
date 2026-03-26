import { toast as sonnerToast } from 'sonner';

/**
 * Tiện ích quản lý thông báo (Toast notifications)
 * Wrapper cho thư viện sonner để dễ dàng sử dụng và tùy chỉnh trạng thái chung.
 */
export const toast = {
  success: (message, options = {}) => {
    sonnerToast.success(message, {
      className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
      ...options,
    });
  },
  
  error: (message, options = {}) => {
    sonnerToast.error(message, {
      className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
      ...options,
    });
  },
  
  info: (message, options = {}) => {
    sonnerToast.info(message, {
      className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
      ...options,
    });
  },
  
  warning: (message, options = {}) => {
    sonnerToast.warning(message, {
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
      ...options,
    });
  },

  // Custom toast without type
  default: (message, options = {}) => {
    sonnerToast(message, options);
  },

  // Để dismiss toast đang hiển thị
  dismiss: (toastId) => {
    sonnerToast.dismiss(toastId);
  }
};

export default toast;
