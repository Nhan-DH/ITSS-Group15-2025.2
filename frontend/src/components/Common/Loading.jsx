import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import useUIStore from '@/store/useUIStore';

export const LoadingSpinner = ({ className, size = "md", colorClass = "text-blue-600 dark:text-blue-500" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };
  
  return (
    <Loader2 className={cn("animate-spin", colorClass, sizes[size], className)} />
  );
};

// Component Loading bao trọn toàn màn hình, lấy tín hiệu trực tiếp từ useUIStore luôn (Global)
export const GlobalLoading = ({ text = "Đang xử lý hệ thống..." }) => {
  const isGlobalLoading = useUIStore((state) => state.isGlobalLoading);

  if (!isGlobalLoading) return null;
  
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl flex flex-col items-center shadow-2xl min-w-[200px]">
        <LoadingSpinner size="xl" className="mb-4" colorClass="text-blue-500" />
        <p className="text-gray-800 dark:text-gray-200 font-medium animate-pulse">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
