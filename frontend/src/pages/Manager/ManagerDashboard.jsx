import React from 'react';
import StatsCard from '@/components/Dashboard/StatsCard';
import RecentActivities from '@/components/Dashboard/RecentActivities';
import UpcomingSchedules from '@/components/Dashboard/UpcomingSchedules';

const ManagerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Bảng Điều Khiển Quản Lý</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Theo dõi tổng quan hoạt động trong ca trực, kiểm tra trạng thái và lịch tập hôm nay.
          </p>
        </div>
      </div>

      <StatsCard />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingSchedules />
        <RecentActivities />
      </div>
    </div>
  );
};

export default ManagerDashboard;
