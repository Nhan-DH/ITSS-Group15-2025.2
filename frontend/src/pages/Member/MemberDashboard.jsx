import React from 'react';
import { QrCode, Calendar, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
  // Mock data for next workout calculation
  const workoutsByDay = {
    7: [
      { time: '08:00', startTime: '08:00', endTime: '09:30', name: 'Buổi tập Yoga', type: 'Yoga', location: 'Phòng A2', trainer: 'Nguyễn Minh', status: 'Đã xong' }
    ],
    10: [
      { time: '09:00', startTime: '09:00', endTime: '10:30', name: 'Buổi tập Core', type: 'Core Training', location: 'Phòng B1', trainer: 'Phạm Thị D', status: 'Đã xong' },
      { time: '14:00', startTime: '14:00', endTime: '15:30', name: 'Buổi tập Skinny fat', type: 'Skinny fat', location: 'Phòng C2', trainer: 'Hoàng Văn E', status: 'Đã xong' }
    ],
    14: [
      { time: '06:00', startTime: '06:00', endTime: '07:30', name: 'Buổi tập Cardio', type: 'Cardio', location: 'Phòng A1', trainer: 'Lê Thị B', status: 'Đã xong' },
      { time: '17:00', startTime: '17:00', endTime: '18:30', name: 'Buổi tập Strength', type: 'Strength Training', location: 'Phòng B2', trainer: 'Trần Văn C', status: 'Đã xong' }
    ],
    17: [
      { time: '10:00', startTime: '10:00', endTime: '11:30', name: 'Buổi tập Cơ lưng', type: 'Back Training', location: 'Phòng C1', trainer: 'Phạm Thị D', status: 'Chờ xác nhận' }
    ],
    22: [
      { time: '07:00', startTime: '07:00', endTime: '08:30', name: 'Lớp HIIT', type: 'HIIT', location: 'Studio CrossFit', trainer: 'Hoàng Văn E', status: 'Chờ xác nhận' },
      { time: '15:00', startTime: '15:00', endTime: '16:30', name: 'Buổi tập Legs', type: 'Leg Training', location: 'Phòng A2', trainer: 'Nguyễn Minh', status: 'Chờ xác nhận' }
    ],
    24: [
      { time: '09:00', startTime: '09:00', endTime: '10:00', name: 'Lớp Boxing', type: 'Boxing', location: 'Studio A', trainer: 'Lê Thị B', status: 'Chưa xác nhận' }
    ],
    25: [
      { time: '18:00', startTime: '18:00', endTime: '19:30', name: 'Buổi tập Flexibility', type: 'Flexibility', location: 'Phòng B3', trainer: 'Trần Văn C', status: 'Chưa xác nhận' }
    ],
    28: [
      { time: '16:00', startTime: '16:00', endTime: '17:30', name: 'Buổi tập Pilates', type: 'Pilates', location: 'Phòng A3', trainer: 'Phạm Thị D', status: 'Chờ xác nhận' }
    ]
  };

  // Get next workout (assuming today is April 14)
  const getNextWorkout = () => {
    const today = 14; // April 14, 2026
    const currentHour = 8; // Current time is 08:00 AM

    // Find next workout starting from today
    for (let day = today; day <= 28; day++) {
      if (workoutsByDay[day]) {
        for (let workout of workoutsByDay[day]) {
          const workoutHour = parseInt(workout.time.split(':')[0]);
          if (day > today || (day === today && workoutHour >= currentHour)) {
            return { day, workout };
          }
        }
      }
    }
    
    // If no workout found this month, return the first one next month
    return { day: 7, workout: workoutsByDay[7][0] };
  };

  const { day, workout } = getNextWorkout();

  const getDayName = (day) => {
    const days = {
      10: 'Hôm nay',
      14: 'Hôm nay',
      17: 'Thứ sáu',
      22: 'Thứ tư',
      24: 'Thứ năm',
      25: 'Thứ sáu',
      28: 'Thứ hai'
    };
    return days[day] || `Ngày ${day}`;
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-full pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Xin chào, Nguyễn Tuấn A 👋</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Tham gia từ: 01/01/2026</p>
      </div>
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
        {/* Package Expiration Rectangle */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <Calendar className="h-8 w-8 text-blue-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">GÓI TẬP HIỆN TẠI</p>
          <p className="font-bold text-gray-900 dark:text-white text-base mb-3 line-clamp-2">Member Premium 6 tháng</p>
          <div className="mb-4">
            <p className="text-xs text-gray-600 dark:text-gray-400">Hết hạn</p>
            <p className="font-bold text-gray-900 dark:text-white text-lg">05/10/2026</p>
          </div>
          <Link
            to="/member/renew"
            className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold underline"
          >
            Làm mới
          </Link>
        </div>

        {/* Next Schedule Rectangle */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <Activity className="h-8 w-8 text-green-500 mb-3" />
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">BUỔI TẬP TIẾP THEO</p>
          <p className="font-bold text-gray-900 dark:text-white text-base mb-2">{workout.time} {getDayName(day)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{workout.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">PT {workout.trainer}</p>
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
