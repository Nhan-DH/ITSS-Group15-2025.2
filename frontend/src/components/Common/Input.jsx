import React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ 
  className, 
  type = 'text',
  label,      // Tên nhãn của ô nhập
  error,      // Truyền chuỗi lỗi của react-hook-form / Zod vào đây
  helperText, // Truyền mô tả hướng dẫn của ô phía dưới (VD: Nhập tối đa 10 kí tự)
  id,
  fullWidth = true, // Mặc định tự kéo dãn 100% chiều ngang
  ...props 
}, ref) => {
  // Tự động sinh ra 1 ID duy nhất dùng cho Label kết nối tới Input (Rất tốt cho chuẩn UX/Accessibility)
  const generatedId = React.useId();
  const inputId = id || generatedId;
  
  return (
    <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
      {/* Hiển thị Label */}
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}
      
      {/* Khung nhập (Input Box) */}
      <input
        id={inputId}
        ref={ref}
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium", // Cho input type="file"
          "placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-950 dark:border-gray-800 dark:text-white",
          // Đổi màu Border thành ĐỎ VÀ ĐẬM nếu bị báo Lỗi (Error)
          error 
            ? "border-red-500 focus-visible:ring-red-500 text-red-900 dark:text-red-400" 
            : "border-gray-300 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
          !fullWidth && "w-auto"
        )}
        {...props} // Chuyển giao toàn bộ properties thừa lại (onChange, onBlur, value, placeholder) cho thẻ input
      />
      
      {/* Cảnh báo đỏ nếu có Lỗi Form (Zod) */}
      {error && (
        <span className="text-xs font-medium text-red-500">
          {error}
        </span>
      )}
      
      {/* Dòng hướng dẫn (Phụ) chỉ xuất hiện nếu KHÔNG bị lỗi */}
      {helperText && !error && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
