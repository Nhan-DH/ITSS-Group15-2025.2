import React, { useEffect, useState } from 'react';
import { CalendarCheck, Loader2 } from 'lucide-react';
import { memberService } from '@/services/memberService';

const formatDateTime = (isoString) => {
  if (!isoString) return { date: '—', time: '—' };
  const d = new Date(isoString);
  return {
    date: d.toLocaleDateString('vi-VN'),
    time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  };
};

const statusLabel = (status) => {
  const map = {
    attended: 'Đã tham gia',
    absent: 'Vắng mặt',
    pending: 'Chờ xác nhận',
  };
  return map[status?.toLowerCase()] || status || '—';
};

const TrainingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    memberService.getMyTrainingHistory()
      .then((res) => {
        const data = res?.data ?? res;
        setHistory(Array.isArray(data) ? data : []);
      })
      .catch(() => setError('Không thể tải lịch sử tập luyện.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nhật ký Hoạt động</h1>
        <p className="text-gray-500 text-sm mt-1">Lịch sử các buổi tập luyện đã qua của bạn.</p>
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {!error && history.length === 0 && (
        <p className="text-center text-gray-400 dark:text-gray-600 mt-10">Chưa có lịch sử tập luyện.</p>
      )}

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent dark:before:via-gray-700">
        {history.map((item, idx) => {
          const { date, time } = formatDateTime(item.session_time);
          return (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-blue-100 text-blue-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:bg-blue-900/40 dark:border-gray-950 z-10">
                <CalendarCheck className="h-4 w-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col dark:bg-gray-950 dark:border-gray-800 transition-all hover:border-blue-300 hover:shadow-md">
                <span className="font-bold text-gray-900 dark:text-white">
                  {item.pt_feedback || 'Buổi tập PT'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {statusLabel(item.attendance_status)}
                </span>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-400">{time}</span>
                  <span className="text-xs text-gray-400 font-medium">{date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainingHistory;
