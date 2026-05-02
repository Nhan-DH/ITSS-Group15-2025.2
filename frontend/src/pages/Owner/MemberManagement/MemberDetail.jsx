import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, CalendarDays, Activity, DollarSign, Clock } from 'lucide-react';
import Button from '@/components/Common/Button';
import { useMemberDetails, useMemberSubscriptionHistory } from '@/hooks/queries/useMembers';

const MemberDetail = () => {
  const { id } = useParams();
  const { data: member, isLoading: memberLoading, isError: memberError } = useMemberDetails(id);
  const { data: historyResponse, isLoading: historyLoading } = useMemberSubscriptionHistory(id, 1, 5);

  if (memberLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Link to="/owner/members">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Chi tiết Hội viên</h1>
            <p className="mt-1 text-sm text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (memberError || !member) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Link to="/owner/members">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Chi tiết Hội viên</h1>
            <p className="mt-1 text-sm text-red-500">Không thể tải thông tin hội viên</p>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="mt-1 text-sm text-gray-500">Xem toàn bộ thông tin về {member.full_name || 'Hội viên'}</p>
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
            <img 
              src={(member.gender || '').toLowerCase() === 'nữ' ? '/src/assets/nu_ava.jpg' : '/src/assets/nam_ava.jpg'} 
              alt="avatar" 
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-sm dark:border-gray-900"
            />
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{member.full_name || 'N/A'}</h2>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">MEM-{member.id || id}</p>
            <span className={`mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
              member.is_active ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {member.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
            </span>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Số điện thoại</p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{member.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{member.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày tham gia</p>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {member.registered_at ? new Date(member.registered_at).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
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
                 <p className="font-bold text-lg text-gray-900 dark:text-white">{member.package_name || 'Chưa có gói tập'}</p>
                 <p className="text-sm text-gray-500 mt-1">
                   {member.package_name ? 'Gói tập hiện tại' : 'Hội viên chưa đăng ký gói tập nào'}
                 </p>
               </div>
               {member.package_name && (
                 <Button variant="outline" size="sm">Gia hạn ngay</Button>
               )}
            </div>
          </div>

          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
    <Activity className="h-5 w-5 text-green-500" />
    Lịch sử đăng ký gói tập
  </h3>

  {historyLoading ? (
    <div className="text-sm text-gray-500 text-center py-8">
      Đang tải lịch sử...
    </div>
  ) : historyResponse?.data?.length > 0 ? (
    <div className="space-y-4">
      {historyResponse.data.map((item) => (
        <div
          key={item.id}
          className="rounded-lg border border-gray-100 p-4 dark:border-gray-800"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {item.package_name}
              </h4>

              <div className="mt-2 space-y-1 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Ngày đăng ký:{" "}
                  {new Date(item.registration_date).toLocaleDateString("vi-VN")}
                </p>

                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Thời hạn:{" "}
                  {new Date(item.start_date).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(item.end_date).toLocaleDateString("vi-VN")}
                </p>

                <p className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {item.price?.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>

            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {item.status === "active" ? "Đang hoạt động" : "Hết hạn"}
            </span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-sm text-gray-500 mt-8 flex flex-col items-center justify-center">
      <Activity className="h-10 w-10 text-gray-200 dark:text-gray-700 mb-2" />
      Chưa có lịch sử gói tập.
    </div>
  )}
</div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
