import React from 'react';
import StatsCard from '@/components/Dashboard/StatsCard';
import RevenueChart from '@/components/Charts/RevenueChart';
import MemberStatsChart from '@/components/Charts/MemberStatsChart';
import PerformanceChart from '@/components/Charts/PerformanceChart';
import RecentActivities from '@/components/Dashboard/RecentActivities';
import UpcomingSchedules from '@/components/Dashboard/UpcomingSchedules';

const OwnerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Tổng quan Hoạt động</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Theo dõi trạng thái phòng tập, doanh thu và hội viên.
          </p>
        </div>
      </div>

      {/* Row 1: Thống kê nhanh */}
      <StatsCard />

      {/* Row 2: Biểu đồ chính (Doanh thu & Hội viên) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <MemberStatsChart />
      </div>

      {/* Row 3: Biểu đồ phụ & Hoạt động gần đây */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PerformanceChart />
        </div>
        <div className="space-y-6">
          <UpcomingSchedules />
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
