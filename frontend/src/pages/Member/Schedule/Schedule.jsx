import React, { useState } from 'react';
import { X } from 'lucide-react';

const Schedule = () => {
  const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 10));
  const [selectedDate, setSelectedDate] = useState('2026-04-14');
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const [workouts] = useState({
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

  const trainerInfo = {
    'Nguyễn Minh': {
      name: 'Nguyễn Minh',
      birthYear: 1992,
      specialization: 'Strength Training, Powerlifting',
      phone: '+84 912 345 678',
      email: 'nguyen.minh@gym.com',
      awards: [
        { icon: '🥇', title: 'HCV Bodybuilding Championship', org: 'VNBF 2023' },
        { icon: '🥈', title: "Á quân Men's Physique", org: 'WBPF 2022' },
        { icon: '🏆', title: 'Top 3 PT of the Year', org: 'ActiveGym 2024' }
      ],
      experience: [
        { position: 'Senior PT — ActiveGym Hà Nội', duration: '2021 – nay · 4 năm' },
        { position: 'Personal Trainer — California Fitness', duration: '2018 – 2021 · 3 năm' },
        { position: 'Chứng chỉ ACE-CPT, ISSN-SNS', duration: '2018' }
      ],
      measurements: {
        height: { value: 180, unit: 'cm' },
        weight: { value: 82, unit: 'kg' },
        chest: { value: 105, unit: 'cm' },
        arm: { value: 40, unit: 'cm' },
        waist: { value: 78, unit: 'cm' },
        forearm: { value: 32, unit: 'cm' },
        thigh: { value: 60, unit: 'cm' },
        calf: { value: 42, unit: 'cm' }
      }
    },
    'Lê Thị B': {
      name: 'Lê Thị B',
      birthYear: 1995,
      specialization: 'Cardio, HIIT, CrossFit',
      phone: '+84 912 345 679',
      email: 'le.thib@gym.com',
      awards: [
        { icon: '🥇', title: 'CrossFit Regional Champion', org: 'Asia 2023' },
        { icon: '🏆', title: 'Best HIIT Instructor', org: 'ActiveGym 2024' }
      ],
      experience: [
        { position: 'Head Instructor — ActiveGym Hà Nội', duration: '2020 – nay · 5 năm' },
        { position: 'Fitness Coach — Pure Gym', duration: '2017 – 2020 · 3 năm' },
        { position: 'Chứng chỉ CrossFit Level 2, ISSN-SNS', duration: '2017' }
      ],
      measurements: {
        height: { value: 165, unit: 'cm' },
        weight: { value: 58, unit: 'kg' },
        chest: { value: 88, unit: 'cm' },
        arm: { value: 28, unit: 'cm' },
        waist: { value: 68, unit: 'cm' },
        forearm: { value: 24, unit: 'cm' },
        thigh: { value: 52, unit: 'cm' },
        calf: { value: 36, unit: 'cm' }
      }
    },
    'Phạm Thị D': {
      name: 'Phạm Thị D',
      birthYear: 1993,
      specialization: 'Personal Training, Core Training',
      phone: '+84 912 345 680',
      email: 'pham.thid@gym.com',
      awards: [
        { icon: '🥇', title: 'Personal Trainer of the Year', org: 'Vietnam Fitness 2023' },
        { icon: '🏆', title: 'Client Transformation Champion', org: 'ActiveGym 2024' }
      ],
      experience: [
        { position: 'Senior PT Manager — ActiveGym Hà Nội', duration: '2019 – nay · 6 năm' },
        { position: 'Personal Trainer — Diamond Fitness', duration: '2016 – 2019 · 3 năm' },
        { position: 'Chứng chỉ ACE-CPT, CES, FMS Level 2', duration: '2016' }
      ],
      measurements: {
        height: { value: 168, unit: 'cm' },
        weight: { value: 62, unit: 'kg' },
        chest: { value: 92, unit: 'cm' },
        arm: { value: 30, unit: 'cm' },
        waist: { value: 70, unit: 'cm' },
        forearm: { value: 26, unit: 'cm' },
        thigh: { value: 55, unit: 'cm' },
        calf: { value: 38, unit: 'cm' }
      }
    },
    'Hoàng Văn E': {
      name: 'Hoàng Văn E',
      birthYear: 1998,
      specialization: 'Zumba, Yoga, Flexibility',
      phone: '+84 912 345 681',
      email: 'hoang.vane@gym.com',
      awards: [
        { icon: '🏆', title: 'Best Group Class Instructor', org: 'ActiveGym 2024' },
        { icon: '⭐', title: 'Highest Client Satisfaction', org: 'Vietnam Fitness 2023' }
      ],
      experience: [
        { position: 'Group Fitness Instructor — ActiveGym Hà Nội', duration: '2021 – nay · 4 năm' },
        { position: 'Yoga Instructor — Zen Fitness', duration: '2019 – 2021 · 2 năm' },
        { position: 'Chứng chỉ Yoga Alliance, Zumba License', duration: '2019' }
      ],
      measurements: {
        height: { value: 172, unit: 'cm' },
        weight: { value: 70, unit: 'kg' },
        chest: { value: 96, unit: 'cm' },
        arm: { value: 32, unit: 'cm' },
        waist: { value: 75, unit: 'cm' },
        forearm: { value: 28, unit: 'cm' },
        thigh: { value: 56, unit: 'cm' },
        calf: { value: 40, unit: 'cm' }
      }
    },
    'Trần Văn C': {
      name: 'Trần Văn C',
      birthYear: 1990,
      specialization: 'Pilates, Flexibility, Rehabilitation',
      phone: '+84 912 345 682',
      email: 'tran.vanc@gym.com',
      awards: [
        { icon: '🥇', title: 'Master Instructor Award', org: 'Pilates Association 2023' },
        { icon: '🏆', title: 'Client Recovery Excellence', org: 'ActiveGym 2024' }
      ],
      experience: [
        { position: 'Pilates Master Instructor — ActiveGym Hà Nội', duration: '2018 – nay · 7 năm' },
        { position: 'Rehabilitation Specialist — Health Clinic', duration: '2015 – 2018 · 3 năm' },
        { position: 'Chứng chỉ Pilates Reformer, FMS Level 3, PTA', duration: '2015' }
      ],
      measurements: {
        height: { value: 175, unit: 'cm' },
        weight: { value: 75, unit: 'kg' },
        chest: { value: 100, unit: 'cm' },
        arm: { value: 36, unit: 'cm' },
        waist: { value: 77, unit: 'cm' },
        forearm: { value: 30, unit: 'cm' },
        thigh: { value: 58, unit: 'cm' },
        calf: { value: 41, unit: 'cm' }
      }
    }
  };

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
  const selectedWorkouts = selectedDate ? workouts[selectedDate] || [] : [];
  const selectedDateObject = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;

  const getCalendarDotClass = (item) => {
    return item.status === 'Đã xong' ? 'bg-green-500' : 'bg-blue-400';
  };

  const getAccentColor = (item) => {
    if (item.status === 'Đã xong') return '#16A34A';
    if (item.status === 'Chờ xác nhận') return '#EAB308';
    return '#9CA3AF';
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Đã xong') {
      return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    }
    if (status === 'Chờ xác nhận') {
      return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full pb-20">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
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
                      {evs.map((item, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${getCalendarDotClass(item)}`} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

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

      <div className="mt-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        {!selectedDate ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-3xl">
              📅
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Chọn một ngày để xem lịch tập của bạn
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {selectedDateObject ? dayNames[selectedDateObject.getDay()] : ''}, {selectedDateObject ? selectedDateObject.getDate() : ''}/
                {selectedDateObject ? String(selectedDateObject.getMonth() + 1).padStart(2, '0') : ''}/
                {selectedDateObject ? selectedDateObject.getFullYear() : ''}
              </div>
              {selectedWorkouts.length > 0 && (
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {selectedWorkouts.length} buổi
                </div>
              )}
            </div>

            {selectedWorkouts.length === 0 ? (
              <div className="text-sm text-gray-400 dark:text-gray-500">
                Không có buổi tập nào
              </div>
            ) : (
              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Lịch tập hôm nay
                </div>
                {selectedWorkouts.map((workout, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-2.5 flex gap-3.5 relative overflow-hidden transition-all"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: getAccentColor(workout) }}
                    />

                    <div className="flex flex-col items-center min-w-12">
                      <div className="text-xs font-bold font-semibold text-gray-700 dark:text-gray-300">
                        {workout.startTime}
                      </div>
                      <div className="w-px h-2 my-1 bg-gray-300 dark:bg-gray-600" />
                      <div className="text-xs text-gray-400 dark:text-gray-500">{workout.endTime}</div>
                    </div>

                    <div className="flex-1 ml-2">
                      <div
                        className="text-sm font-bold mb-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-800 dark:text-white"
                        onClick={() => setSelectedWorkout(workout)}
                      >
                        {workout.name}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          {workout.location}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {workout.type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <button
                          onClick={() => setSelectedTrainer(workout.trainer)}
                          className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer transition-colors"
                        >
                          PT {workout.trainer}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div
                        className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap ${getStatusBadgeClass(
                          workout.status
                        )}`}
                      >
                        {workout.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedWorkout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white dark:bg-gray-950 rounded-xl w-full max-w-md border border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết buổi tập</h2>
              <button
                onClick={() => setSelectedWorkout(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4">
              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Tên buổi tập</div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedWorkout.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Thời gian bắt đầu</div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWorkout.startTime}</p>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Thời gian kết thúc</div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedWorkout.endTime}</p>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Giáo trình</div>
                <p className="text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg inline-block">
                  {selectedWorkout.type}
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Địa điểm</div>
                <p className="text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  {selectedWorkout.location}
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Huấn luyện viên</div>
                <button
                  onClick={() => {
                    setSelectedWorkout(null);
                    setSelectedTrainer(selectedWorkout.trainer);
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  {selectedWorkout.trainer}
                </button>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">Trạng thái</div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap inline-block ${getStatusBadgeClass(
                    selectedWorkout.status
                  )}`}
                >
                  {selectedWorkout.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
              <button
                onClick={() => setSelectedWorkout(null)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTrainer && trainerInfo[selectedTrainer] && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-xl max-w-2xl w-full my-auto border border-gray-200 dark:border-gray-800">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thông tin huấn luyện viên</h2>
              <button
                onClick={() => setSelectedTrainer(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl font-semibold text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-700 mb-4">
                    {trainerInfo[selectedTrainer].name.charAt(0)}
                  </div>
                  <div className="text-center">
                    <div className="text-base font-semibold text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Năm sinh: {trainerInfo[selectedTrainer].birthYear}</div>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                      TRAINER
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Thông tin cơ bản</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Họ và tên</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Năm sinh</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].birthYear}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Số điện thoại</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].phone}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Email</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Chuyên môn</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerInfo[selectedTrainer].specialization}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Giải thưởng</h3>
                  <div className="space-y-3">
                    {trainerInfo[selectedTrainer].awards.map((award, idx) => (
                      <div key={idx} className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-sm flex-shrink-0">
                          {award.icon}
                        </div>
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">{award.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{award.org}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Kinh nghiệm</h3>
                  <div className="space-y-3">
                    {trainerInfo[selectedTrainer].experience.map((exp, idx) => (
                      <div key={idx} className="flex gap-2.5">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${idx === 0 ? 'bg-blue-600' : 'bg-blue-300'}`} />
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">{exp.position}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{exp.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Số đo thể hình</h3>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(trainerInfo[selectedTrainer].measurements).map(([key, val]) => {
                    const labels = {
                      height: 'Chiều cao',
                      weight: 'Cân nặng',
                      chest: 'Ngực',
                      arm: 'Bắp tay',
                      waist: 'Bụng',
                      forearm: 'Cẳng tay',
                      thigh: 'Đùi',
                      calf: 'Bắp chuối'
                    };
                    return (
                      <div key={key} className="bg-white dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400">{labels[key]}</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                          {val.value} <span className="text-xs text-gray-600 dark:text-gray-400">{val.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Liên hệ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
