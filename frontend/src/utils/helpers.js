import { differenceInDays, parseISO, isValid } from 'date-fns';

/**
 * Hàm trì hoãn thực thi chức năng liên tục (dùng cho thanh Search liên tục gọi API)
 * @param {Function} func Hàm cần thực thi
 * @param {number} wait Thời gian delay (ms)
 * @returns {Function} 
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Tính toán số ngày còn lại của Gói tập Gym tính từ hôm nay
 * @param {string|Date} endDateStr Ngày kết thúc gói tập
 * @returns {number} Số ngày còn lại (hoặc 0 nếu đã hết hạn)
 */
export const calculateRemainingDays = (endDateStr) => {
  if (!endDateStr) return 0;
  try {
    const end = typeof endDateStr === "string" ? parseISO(endDateStr) : endDateStr;
    if (!isValid(end)) return 0;
    
    const now = new Date();
    const days = differenceInDays(end, now);
    
    return days > 0 ? days : 0;
  } catch {
    return 0;
  }
};

/**
 * Kiểm tra xem người dùng có quyền truy cập dựa trên danh sách roles không
 * @param {string} userRole Role của user hiện tại
 * @param {Array<string>} allowedRoles Danh sách các Role được cho phép
 * @returns {boolean}
 */
export const hasRoleAccess = (userRole, allowedRoles = []) => {
  if (!userRole || !Array.isArray(allowedRoles)) return false;
  return allowedRoles.includes(userRole);
};
