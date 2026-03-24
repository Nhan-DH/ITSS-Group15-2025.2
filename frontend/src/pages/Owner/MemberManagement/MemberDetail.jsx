import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, CalendarDays, Activity } from 'lucide-react';
import Button from '@/components/Common/Button';

const MemberDetail = () => {
  const { id } = useParams();

  // Đây sẽ là logic sử dụng useMemberQuery data dựa trên id, dùng fix cung trước trong giai đoạn chưa có API trọn bộ
  const mockMember = {
    memberCode: `MEM-${id}`,
    fullName: "Nguyễn Văn Hội Viên",
    phone: "0901234567",
    email: "hoivien@activegym.vn",
    status: "active",
    joinDate: "01/10/2024",
    packageEnds: "01/10/2025"
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/owner/members">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Chi tiết Hội viên</h1>
            <p className="mt-1 text-sm text-gray-500">Xem toàn bộ thông tin về {mockMember.fullName}</p>
          </div>
        </div>
        <Link to={`/owner/members/${id}/edit`}>
          <Button leftIcon={<Edit className="h-4 w-4" />}>
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Info Card */}
        <div className="col-span-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-col items-center border-b border-gray-100 pb-6 dark:border-gray-800">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              {mockMember.fullName.charAt(0)}
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{mockMember.fullName}</h2>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{mockMember.memberCode}</p>
            <span className="mt-3 inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400">
              Đang hoạt động
            </span>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Số điện thoại</p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{mockMember.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{mockMember.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày tham gia</p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{mockMember.joinDate}</p>
            </div>
          </div>
        </div>

        {/* History / Package Content */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
              <CalendarDays className="h-5 w-5 text-blue-500" /> Gói tập hiện tại
            </h3>
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100 dark:bg-gray-900/50 dark:border-gray-800 flex justify-between items-center">
               <div>
                 <p className="font-bold text-lg text-gray-900 dark:text-white">Gói VIP 12 Tháng</p>
                 <p className="text-sm text-gray-500 mt-1">Hết hạn vào: <span className="font-semibold text-red-500">{mockMember.packageEnds}</span></p>
               </div>
               <Button variant="outline" size="sm">Gia hạn ngay</Button>
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
              <Activity className="h-5 w-5 text-green-500" /> Lịch sử đăng ký và thanh toán
            </h3>
            <div className="text-sm text-gray-500 mt-8 flex flex-col items-center justify-center">
              <Activity className="h-10 w-10 text-gray-200 dark:text-gray-700 mb-2" />
              Chưa có dữ liệu giao dịch lịch sử.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
