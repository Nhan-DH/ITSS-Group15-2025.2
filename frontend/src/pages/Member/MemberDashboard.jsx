import React, { useEffect, useState } from 'react';
import { QrCode, Calendar, Activity, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { memberService } from '@/services/memberService';
import { packageService } from '@/services/packageService';

const MemberDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [activePackage, setActivePackage] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [profileRes, packagesRes, scheduleRes] = await Promise.allSettled([
          memberService.getMe(),
          packageService.getMemberPackages(),
          memberService.getMySchedule(),
        ]);

        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value?.data ?? profileRes.value);
        }
        if (packagesRes.status === 'fulfilled') {
          const pkgs = packagesRes.value?.data ?? packagesRes.value;
          const sorted = Array.isArray(pkgs) ? pkgs.filter((p) => p.status === 'active').sort((a, b) => new Date(b.startDate) - new Date(a.startDate)) : [];
          setActivePackage(sorted[0] ?? null);
        }
        if (scheduleRes.status === 'fulfilled') {
          const sched = scheduleRes.value?.data ?? scheduleRes.value;
          setSchedule(sched);
        }
      } catch (err) {
        console.error(err);
        // silent — từng phần sẽ hiển thị fallback
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const fullName = profile?.full_name || profile?.name || 'Hội viên';
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('vi-VN')
    : '—';
  const memberCode = profile?.id ? `MEM-${String(profile.id).padStart(6, '0')}` : '—';

  const packageName = activePackage?.name || '—';
  const packageEnd = activePackage?.endDate
    ? new Date(activePackage.endDate).toLocaleDateString('vi-VN')
    : '—';

  const nextSession = schedule?.upcoming_sessions?.[0] ?? null;
  const nextBooking = schedule?.booking_requests?.[0] ?? null;
  const nextItem = nextSession || nextBooking;
  const nextTime = nextItem?.session_time || nextItem?.requested_schedule;
  const nextLabel = nextTime
    ? new Date(nextTime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-full pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Xin chào, {fullName} 👋</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tham gia từ: {joinDate}</p>
      </div>

      {/* Member Card */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 shadow-lg text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <h2 className="font-medium text-blue-100 mb-4 tracking-wider text-sm">THẺ HỘI VIÊN ĐIỆN TỬ</h2>
        <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-4 shadow-sm">
          <QrCode className="h-40 w-40 text-gray-900" />
        </div>
        <p className="font-mono text-xl tracking-widest font-bold">{memberCode}</p>
        <p className="text-sm text-blue-200 mt-2">Đưa mã này vào máy quét tại Quầy Lễ Tân</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Package */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <Calendar className="h-8 w-8 text-blue-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">GÓI TẬP HIỆN TẠI</p>
          <p className="font-bold text-gray-900 dark:text-white text-base mb-3 line-clamp-2">
            {activePackage ? packageName : 'Chưa có gói tập'}
          </p>
          {activePackage ? (
            <div className="mb-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">Hết hạn</p>
              <p className="font-bold text-gray-900 dark:text-white text-lg">{packageEnd}</p>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-xs text-gray-500">Hãy đăng ký gói tập để bắt đầu!</p>
            </div>
          )}
          <Link
            to={activePackage ? '/member/renew' : '/member/register'}
            className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold underline"
          >
            {activePackage ? 'Làm mới' : 'Đăng ký ngay'}
          </Link>
        </div>

        {/* Next Session */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <Activity className="h-8 w-8 text-green-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">BUỔI TẬP TIẾP THEO</p>
          {nextLabel ? (
            <>
              <p className="font-bold text-gray-900 dark:text-white text-base mb-2">{nextLabel}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {nextSession ? 'Buổi tập PT đã xác nhận' : 'Chờ xác nhận lịch'}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Chưa có lịch sắp tới</p>
          )}
          <Link
            to="/member/schedule"
            className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold underline"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
