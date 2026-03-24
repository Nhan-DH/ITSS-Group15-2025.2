import React from 'react';
import UpcomingSchedules from '@/components/Dashboard/UpcomingSchedules';

const TrainerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Bảng Điều Khiển Huấn Luyện Viên</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tổng quan lịch dạy hôm nay và theo dõi tiến độ học viên đang phụ trách.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-sm font-medium text-gray-500">Ca Tập Hôm Nay</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">4</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-sm font-medium text-gray-500">Học Viên Active</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">12</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-sm font-medium text-gray-500">Đánh Giá TB (Feedback)</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">4.8 <span className="text-xl text-yellow-400">★</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingSchedules />
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ghi Chú Cá Nhân</h3>
          <textarea className="w-full h-40 p-3 border border-gray-200 rounded-md dark:border-gray-800 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Viết note chuẩn bị bài tập..."></textarea>
        </div>
      </div>
    </div>
  );
};
export default TrainerDashboard;
