import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Hàm hỗ trợ (helper) dùng để nối các class của TailwindCSS.
 * Giải quyết triệt để lỗi xung đột class (Ví dụ: truyền 'bg-red-500' ghi đè lên 'bg-blue-500' mặc định).
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
