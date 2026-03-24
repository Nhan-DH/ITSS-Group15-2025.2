import React from 'react';
import { QrCode, Calendar, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-full pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Xin chào, Nguyễn Tuấn A 👋</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tham gia từ: 01/01/2026</p>
      </div>

      {/* QR Check-in Card (Mobile specific) */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 shadow-lg text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <h2 className="font-medium text-blue-100 mb-4 tracking-wider text-sm">THẺ HỘI VIÊN ĐIỆN TỬ</h2>
        <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-4 shadow-sm">
          <QrCode className="h-40 w-40 text-gray-900" />
        </div>
        <p className="font-mono text-xl tracking-widest font-bold">MEM-982312</p>
        <p className="text-sm text-blue-200 mt-2">Đưa mã này vào máy quét tại Quầy Lễ Tân</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <Activity className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Buổi tập tháng này</p>
          <p className="mt-1 text-2xl font-bold dark:text-white">12</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <Calendar className="h-6 w-6 text-green-500 mb-2" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hạn gói tập</p>
          <p className="mt-1 text-xl font-bold text-red-500 dark:text-red-400">22 ngày</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg dark:text-white">Lịch Tập Gần Nhất</h3>
          <Link to="/member/history" className="text-blue-500 text-sm font-medium flex items-center hover:underline">
            Chi tiết <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
           <p className="font-semibold text-gray-900 dark:text-gray-100">18:00 Hôm nay</p>
           <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">PT Lê Thị B (Ngực & Tay sau)</p>
        </div>
      </div>
    </div>
  );
};
export default MemberDashboard;
