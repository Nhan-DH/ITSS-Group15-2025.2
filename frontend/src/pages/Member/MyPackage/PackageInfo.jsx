import React from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';

const PackageInfo = () => {
  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gói Tập Của Tôi</h1>
      
      <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-6 dark:bg-emerald-900/10 dark:border-emerald-600/50 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1.5 text-xs font-bold rounded-bl-xl shadow-sm">ĐANG KÍCH HOẠT</div>
        <h2 className="text-xl font-black text-emerald-800 dark:text-emerald-400 pr-24 leading-snug">Gói Thể Thao VIP 12 Tháng</h2>
        <p className="text-emerald-600 mt-2 dark:text-emerald-500 font-bold text-lg">3,000,000 đ</p>
        
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" /> <span className="text-sm font-medium">Tập tự do mọi lúc (5:30 - 22:00)</span>
          </div>
          <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" /> <span className="text-sm font-medium">Được tham gia các lớp Yoga, Zumba cơ bản</span>
          </div>
          <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" /> <span className="text-sm font-medium">Sử dụng phòng tắm, xông hơi free</span>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-emerald-200 dark:border-emerald-800/40 flex justify-between items-end">
          <div>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 uppercase tracking-wider font-semibold">Ngày hết hạn</p>
            <p className="font-bold text-emerald-900 dark:text-emerald-200 text-xl mt-1">15/04/2026</p>
          </div>
          <CreditCard className="h-10 w-10 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
export default PackageInfo;
