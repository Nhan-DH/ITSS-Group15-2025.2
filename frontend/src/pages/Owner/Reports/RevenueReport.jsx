import React from 'react';
import RevenueChart from '@/components/Charts/RevenueChart';
import { Download, TrendingUp, Users } from 'lucide-react';
import Button from '@/components/Common/Button';

const RevenueReport = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Báo cáo Doanh thu</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Phân tích số liệu tài chính chuyên sâu.
          </p>
        </div>
        <Button leftIcon={<Download className="h-4 w-4" />}>
          Xuất báo cáo PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tổng doanh thu Tháng này</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">124,500,000 đ</p>
          </div>
          <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 dark:bg-green-900/30 dark:text-green-500">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
        
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Số Gói Tập mới bán được</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">85</p>
          </div>
          <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-500">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <RevenueChart />
      </div>

      {/* Placeholder table cho chi tiết từng giao dịch, vì solo dev form có thẻ ngắn */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Lịch sử giao dịch gần nhất</h3>
        <p className="text-gray-500 text-sm text-center py-8">Tích hợp dữ liệu giao dịch chi tiết từ API Payment sau...</p>
      </div>
    </div>
  );
};

export default RevenueReport;
