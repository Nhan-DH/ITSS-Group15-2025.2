import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react'; // Icon loading xoay tròn

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  leftIcon, 
  rightIcon, 
  disabled, 
  children, 
  ...props 
}, ref) => {
  
  // Style dùng vĩnh viễn không thay đổi
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  // Cấu hình các Bảng màu (Variants)
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
  };
  
  // Cấu hình Kích cỡ chữ, lề (Sizes)
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10' // Chuyên dùng cho icon button hình vuông
  };

  return (
    <button
      ref={ref}
      disabled={isLoading || disabled}
      // Dùng hàm cn() để gộp Base + Chọn Variant + Chọn Size + Custom Class truyền từ bên ngoài
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {/* Tính năng tự xoay Loading nếu đang gọi API */}
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      
      {/* Icon bên trái chữ */}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      
      {/* Text nội dung của Button */}
      {children}
      
      {/* Icon bên phải chữ */}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
