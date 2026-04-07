import React from 'react';
import { ArrowUpRight, Users, ShieldCheck, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Common/Button';
import StatsCard from '@/components/Dashboard/StatsCard';
import RevenueChart from '@/components/Charts/RevenueChart';
import MemberStatsChart from '@/components/Charts/MemberStatsChart';
import PerformanceChart from '@/components/Charts/PerformanceChart';
import RetentionChart from '@/components/Charts/RetentionChart';
import PackagePerformanceChart from '@/components/Charts/PackagePerformanceChart';
import EquipmentStatusChart from '@/components/Charts/EquipmentStatusChart';
import RecentActivities from '@/components/Dashboard/RecentActivities';
import UpcomingSchedules from '@/components/Dashboard/UpcomingSchedules';

const stats = [
  {
    title: 'Doanh thu tháng này',
    value: '124,500,000 đ',
    icon: ArrowUpRight,
    trend: 'up',
    trendValue: '+18%'
  },
  {
    title: 'Hội viên mới',
    value: '42',
    icon: Users,
    trend: 'up',
    trendValue: '+12%'
  },
  {
    title: 'Tỷ lệ giữ chân',
    value: '89%',
    icon: ShieldCheck,
    trend: 'up',
    trendValue: '+4%'
  },
  {
    title: 'Thiết bị cần bảo trì',
    value: '4',
    icon: Wrench,
    trend: 'neutral',
    trendValue: 'Không đổi'
  }
];

const schedules = [
  { id: 1, title: 'Lớp Yoga buổi sáng', time: 'Hôm nay 08:00 - 09:00', room: 'Phòng Yoga 1', trainer: 'PT Linh', type: 'group' },
  { id: 2, title: 'PT cá nhân Khánh', time: 'Hôm nay 10:30 - 11:30', room: 'Phòng 2', trainer: 'PT Minh', type: 'pt' },
  { id: 3, title: 'Bảo trì thiết bị', time: 'Ngày mai 14:00', room: 'Khu Cardio', trainer: 'Kỹ thuật', type: 'group' },
];

const activities = [
  { id: 1, type: 'registration', user: 'Nguyễn Thanh', action: 'đã đăng ký gói VIP tháng 6', time: '2 giờ trước', description: 'Gói VIP kèm xông hơi và PT' },
  { id: 2, type: 'payment', user: 'Hoàng Anh', action: 'thanh toán gia hạn gói 6 tháng', time: '5 giờ trước', description: 'Gia hạn tự động thành công' },
  { id: 3, type: 'booking', user: 'PT Minh', action: 'đã xác nhận lịch dạy', time: 'Hôm qua', description: 'Khung 17:00 - 18:00 tại Phòng 2' },
];

const OwnerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Tổng quan Chủ phòng tập</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Xem nhanh doanh thu, hội viên, thiết bị và nhân sự để ra quyết định chiến lược.
          </p>
        </div>
        <Link to="/owner/reports" className="flex items-center justify-center">
          <Button variant="outline" size="lg">Xem báo cáo tổng hợp</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <StatsCard key={card.title} title={card.title} value={card.value} icon={card.icon} trend={card.trend} trendValue={card.trendValue} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <RetentionChart />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <MemberStatsChart className="xl:col-span-2" />
        <PackagePerformanceChart className="xl:col-span-1" />
        <EquipmentStatusChart className="xl:col-span-1" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <PerformanceChart />
          <UpcomingSchedules schedules={schedules} />
        </div>
        <RecentActivities activities={activities} />
      </div>
    </div>
  );
};

export default OwnerDashboard;
