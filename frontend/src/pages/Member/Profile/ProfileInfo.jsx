import React, { useEffect, useState } from 'react';
import { User, Phone, Mail, MapPin, Edit3, ShieldCheck, Calendar, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@/components/Common/Button';
import { memberService } from '@/services/memberService';

const formatGender = (raw) => {
  if (!raw) return '—';
  const map = {
    male: 'Nam', nam: 'Nam',
    female: 'Nữ', nữ: 'Nữ', nu: 'Nữ',
    other: 'Khác', khác: 'Khác', khac: 'Khác',
  };
  return map[raw.toLowerCase().trim()] ?? raw;
};

const ProfileInfo = () => {
  const location = useLocation();
  const [profile, setProfile] = useState(location.state?.profile || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await memberService.getMe();
        setProfile(data?.data ?? data);
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin hồ sơ.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [location.state?.refreshedAt]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  const fullName = profile?.full_name || profile?.fullName || profile?.name || '—';
  const phone = profile?.phone || '—';
  const email = profile?.email || '—';
  const gender = formatGender(profile?.gender);
  const dob = profile?.dob ? new Date(profile.dob).toLocaleDateString('vi-VN') : '—';
  const address = profile?.address || '—';
  const memberCode = profile?.member_code || profile?.id ? `MEM-${String(profile?.id).padStart(6, '0')}` : '—';

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-20 md:max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tài Khoản</h1>
        <Link to="/member/profile/edit" state={{ profile }}>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-blue-200 px-5 font-semibold text-blue-600 shadow-sm hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40"
            leftIcon={<Edit3 className="h-4 w-4" />}
          >
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="relative h-32 w-full bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            <ShieldCheck className="h-3 w-3" /> Đã xác thực
          </div>
          <div className="absolute -bottom-12 left-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-gray-100 shadow-md dark:border-gray-950">
            <User className="h-14 w-14 text-gray-400" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-16 sm:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{fullName}</h2>
          <p className="mt-1 font-mono text-sm font-semibold tracking-wide text-blue-600">{memberCode}</p>

          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <Phone className="h-5 w-5" />
              </div>
              <span className="text-lg font-medium leading-none">{phone}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <Mail className="h-5 w-5" />
              </div>
              <span className="font-medium leading-none text-gray-600 dark:text-gray-400">{email}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <User className="h-5 w-5" />
              </div>
              <span className="font-medium leading-none text-gray-600 dark:text-gray-400">Giới tính: {gender}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="font-medium leading-none text-gray-600 dark:text-gray-400">Ngày sinh: {dob}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="shrink-0 rounded-xl bg-gray-50 p-2.5 text-gray-500 dark:bg-gray-900">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="font-medium leading-snug text-gray-600 dark:text-gray-400">{address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
