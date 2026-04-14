import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Schedule = () => {
  const navigate = useNavigate();
  const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 10)); // April 10, 2026
  const [selectedDate, setSelectedDate] = useState('2026-04-14');

  // Mock data using date key format (YYYY-MM-DD)
  const [workouts, setWorkouts] = useState({
    '2026-04-07': [
      { time: '08:00', startTime: '08:00', endTime: '09:30', name: 'Buổi tập Yoga', type: 'Yoga', location: 'Phòng A2', trainer: 'Nguyễn Minh', status: 'Đã xong' }
    ],
    '2026-04-10': [
      { time: '09:00', startTime: '09:00', endTime: '10:30', name: 'Buổi tập Core', type: 'Core Training', location: 'Phòng B1', trainer: 'Phạm Thị D', status: 'Đã xong' },
      { time: '14:00', startTime: '14:00', endTime: '15:30', name: 'Buổi tập Skinny fat', type: 'Skinny fat', location: 'Phòng C2', trainer: 'Hoàng Văn E', status: 'Đã xong' }
    ],
    '2026-04-14': [
      { time: '06:00', startTime: '06:00', endTime: '07:30', name: 'Buổi tập Cardio', type: 'Cardio', location: 'Phòng A1', trainer: 'Lê Thị B', status: 'Đã xong' },
      { time: '17:00', startTime: '17:00', endTime: '18:30', name: 'Buổi tập Strength', type: 'Strength Training', location: 'Phòng B2', trainer: 'Trần Văn C', status: 'Đã xong' }
    ],
    '2026-04-17': [
      { time: '10:00', startTime: '10:00', endTime: '11:30', name: 'Buổi tập Cơ lưng', type: 'Back Training', location: 'Phòng C1', trainer: 'Phạm Thị D', status: 'Chờ xác nhận' }
    ],
    '2026-04-22': [
      { time: '07:00', startTime: '07:00', endTime: '08:30', name: 'Lớp HIIT', type: 'HIIT', location: 'Studio CrossFit', trainer: 'Hoàng Văn E', status: 'Chờ xác nhận' },
      { time: '15:00', startTime: '15:00', endTime: '16:30', name: 'Buổi tập Legs', type: 'Leg Training', location: 'Phòng A2', trainer: 'Nguyễn Minh', status: 'Chờ xác nhận' }
    ],
    '2026-04-24': [
      { time: '09:00', startTime: '09:00', endTime: '10:00', name: 'Lớp Boxing', type: 'Boxing', location: 'Studio A', trainer: 'Lê Thị B', status: 'Chưa xác nhận' }
    ],
    '2026-04-25': [
      { time: '18:00', startTime: '18:00', endTime: '19:30', name: 'Buổi tập Flexibility', type: 'Flexibility', location: 'Phòng B3', trainer: 'Trần Văn C', status: 'Chưa xác nhận' }
    ],
    '2026-04-28': [
      { time: '16:00', startTime: '16:00', endTime: '17:30', name: 'Buổi tập Pilates', type: 'Pilates', location: 'Phòng A3', trainer: 'Phạm Thị D', status: 'Chờ xác nhận' }
    ]
  });

  const dateKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const buildCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const first = new Date(year, month, 1).getDay();
    const offset = first === 0 ? 6 : first - 1;
    const dim = new Date(year, month + 1, 0).getDate();
    const prev = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = offset - 1; i >= 0; i--) {
      days.push({ day: prev - i, isCurrentMonth: false });
    }
    for (let d = 1; d <= dim; d++) {
      days.push({ day: d, isCurrentMonth: true });
    }
    let nx = 1;
    const tot = offset + dim;
    const rem = tot % 7 === 0 ? 0 : 7 - (tot % 7);
    for (let i = 0; i < rem; i++) {
      days.push({ day: nx++, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = buildCalendar();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const selectDay = (d) => {
    const key = dateKey(year, month, d);
    setSelectedDate(key);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const dayNames = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const monthName = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  const selectedWorkouts = selectedDate ? (workouts[selectedDate] || []) : [];

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full pb-20">
      <button
        onClick={() => navigate('/member')}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại tổng quan
      </button>

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
        {/* Calendar Header and Navigation */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={previousMonth}
              className="w-7 h-7 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              ‹
            </button>
            <div className="text-sm font-bold text-gray-800 dark:text-white capitalize">{monthName}</div>
            <button
              onClick={nextMonth}
              className="w-7 h-7 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              ›
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-xs font-bold text-gray-400 dark:text-gray-500 text-center py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayObj, idx) => {
              const key = dayObj.isCurrentMonth ? dateKey(year, month, dayObj.day) : null;
              const evs = key ? workouts[key] || [] : [];
              const isSelected = selectedDate === key;

              return (
                <div
                  key={idx}
                  onClick={() => dayObj.isCurrentMonth && selectDay(dayObj.day)}
                  className={`h-14 flex flex-col items-center justify-center rounded text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold'
                      : dayObj.isCurrentMonth
                      ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  <span className="text-sm font-semibold">{dayObj.day}</span>
                  {evs.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {evs.map((e, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            e.status === 'Đã xong' ? 'bg-green-500' : 'bg-blue-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Tháng này</div>
            <div className="text-xl font-black text-gray-800 dark:text-white">
              8 <span className="text-xs text-gray-400 dark:text-gray-500">buổi</span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3">
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Đã hoàn thành</div>
            <div className="text-xl font-black text-gray-800 dark:text-white">
              4 <span className="text-xs text-gray-400 dark:text-gray-500">buổi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workouts Detail Panel */}
      <div className="mt-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        {!selectedDate ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-3xl">
              📅
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-500">Chọn một ngày để xem lịch tập</div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {dayNames[new Date(year, month, parseInt(selectedDate.split('-')[2])).getDay()]}, {selectedDate.split('-')[2]}/{String(month + 1).padStart(2, '0')}/{year}
              </div>
              {selectedWorkouts && selectedWorkouts.length > 0 && (
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {selectedWorkouts.length} buổi
                </div>
              )}
            </div>

            {!selectedWorkouts || selectedWorkouts.length === 0 ? (
              <div className="text-sm text-gray-400 dark:text-gray-500">Không có buổi tập nào</div>
            ) : (
              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Lịch hôm nay
                </div>
                {selectedWorkouts.map((workout, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-2.5 flex gap-3.5 relative overflow-hidden"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{
                        backgroundColor:
                          workout.status === 'Đã xong'
                            ? '#16A34A'
                            : workout.status === 'Chờ xác nhận'
                            ? '#EAB308'
                            : '#9CA3AF'
                      }}
                    />

                    <div className="flex flex-col items-center min-w-12">
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 font-semibold">
                        {workout.startTime}
                      </div>
                      <div className="w-px h-2 bg-gray-300 dark:bg-gray-600 my-1" />
                      <div className="text-xs text-gray-400 dark:text-gray-500">{workout.endTime}</div>
                    </div>

                    <div className="flex-1 ml-2">
                      <div className="text-sm font-bold text-gray-800 dark:text-white mb-2">{workout.name}</div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                          {workout.location}
                        </span>
                        <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                          {workout.type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        PT {workout.trainer}
                      </div>
                    </div>

                    <div
                      className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap self-start ${
                        workout.status === 'Đã xong'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : workout.status === 'Chờ xác nhận'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {workout.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
