import React, { useState } from 'react';
import { toast } from 'sonner';

const TrainerSchedule = () => {
  const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  const [events, setEvents] = useState({
    '2026-04-17': [
      { start: '08:25', end: '10:05', name: 'Buổi tập Skinny fat', curriculum: 'Skinny fat', room: 'Phòng B1', student: 'Nguyễn Tuấn A', done: false, confirmed: false },
      { start: '10:15', end: '11:45', name: 'Buổi tập Strength', curriculum: 'Strength Basic', room: 'Phòng B2', student: 'Trần Thị B', done: false, confirmed: false },
    ],
    '2026-04-14': [{ start: '07:00', end: '08:30', name: 'Buổi tập Cardio Mix', curriculum: 'Cardio Mix', room: 'Phòng A1', student: 'Lê Văn C', done: true, confirmed: true }],
    '2026-04-10': [
      { start: '09:00', end: '10:30', name: 'Buổi tập Core', curriculum: 'Core Training', room: 'Phòng B1', student: 'Phạm Thị D', done: true, confirmed: true },
      { start: '14:00', end: '15:30', name: 'Buổi tập Skinny fat', curriculum: 'Skinny fat', room: 'Phòng C2', student: 'Hoàng Văn E', done: true, confirmed: true },
    ],
    '2026-04-07': [{ start: '08:00', end: '09:30', name: 'Buổi tập Strength', curriculum: 'Strength Basic', room: 'Phòng B1', student: 'Nguyễn Tuấn A', done: true, confirmed: true }],
    '2026-04-22': [{ start: '10:00', end: '11:30', name: 'Buổi tập Skinny fat', curriculum: 'Skinny fat', room: 'Phòng B1', student: 'Nguyễn Tuấn A', done: false, confirmed: false }],
    '2026-04-24': [{ start: '15:00', end: '16:30', name: 'Buổi tập Cardio', curriculum: 'Cardio Mix', room: 'Phòng A2', student: 'Trần Thị B', done: false, confirmed: false }],
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [screen, setScreen] = useState(1);

  const dateKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const buildCalendar = () => {
    const year = 2026;
    const month = 3;
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
  const year = 2026;
  const month = 3;

  const selectDay = (d) => {
    const key = dateKey(year, month, d);
    setSelectedDate(key);
    setScreen(1);
  };

  const openDetail = (key, idx) => {
    if (!events[key] || !events[key][idx]) {
      toast.error('Lỗi', { description: 'Không thể tải dữ liệu buổi tập' });
      return;
    }
    const ev = events[key][idx];
    setSelectedEvent({ key, idx, event: ev });
    if (ev.done) {
      setScreen(3);
    } else {
      setScreen(2);
    }
  };

  const confirmAttend = () => {
    if (!selectedEvent) return;
    const updatedEvents = JSON.parse(JSON.stringify(events));
    updatedEvents[selectedEvent.key][selectedEvent.idx].confirmed = true;
    setEvents(updatedEvents);
    toast.success('Xác nhận thành công', {
      description: 'Bạn đã xác nhận tham gia buổi tập',
    });
    setTimeout(() => setScreen(1), 1200);
  };

  const dayNames = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  // Screen 1 - Calendar and events
  if (screen === 1) {
    return (
      <div className="flex flex-col flex-1 bg-gray-50 p-6 max-w-5xl mx-auto w-full">
        {/* Calendar Panel - Full Width */}
        <div className="bg-white border border-gray-200 flex flex-col rounded-xl mb-6">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">‹</button>
              <div className="text-sm font-bold text-gray-800">Tháng 4, 2026</div>
              <button className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">›</button>
            </div>

            <div className="grid grid-cols-7 gap-0 mb-2">
              {DAYS.map((day) => (
                <div key={day} className="text-xs font-bold text-gray-400 text-center py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayObj, idx) => {
                const key = dayObj.isCurrentMonth ? dateKey(year, month, dayObj.day) : null;
                const evs = key ? events[key] || [] : [];
                const isSelected = selectedDate === key;
                const isToday = dayObj.isCurrentMonth && dayObj.day === 11;

                return (
                  <div
                    key={idx}
                    onClick={() => dayObj.isCurrentMonth && selectDay(dayObj.day)}
                    className={`h-14 flex flex-col items-center justify-center rounded text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold'
                        : dayObj.isCurrentMonth
                        ? 'hover:bg-gray-100 text-gray-700'
                        : 'text-gray-300'
                    }`}
                  >
                    <span className="text-sm font-semibold">{dayObj.day}</span>
                    {evs.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {evs.map((e, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${e.done ? 'bg-green-600' : 'bg-blue-400'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 p-4 grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-bold text-gray-400 uppercase mb-1">Tháng này</div>
              <div className="text-xl font-black text-gray-800">7 <span className="text-xs text-gray-400">buổi</span></div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-bold text-gray-400 uppercase mb-1">Đã hoàn thành</div>
              <div className="text-xl font-black text-gray-800">4 <span className="text-xs text-gray-400">buổi</span></div>
            </div>
          </div>
        </div>

        {/* Detail Panel - Below Calendar, Full Width */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6">
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-3xl">📅</div>
              <div className="text-sm text-gray-400">Chọn một ngày để xem lịch dạy</div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-semibold text-gray-500">
                  {dayNames[new Date(year, month, parseInt(selectedDate.split('-')[2])).getDay()]}, {selectedDate.split('-')[2]}/04/2026
                </div>
                {events[selectedDate] && events[selectedDate].length > 0 && (
                  <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {events[selectedDate].length} buổi
                  </div>
                )}
              </div>

              {!events[selectedDate] || events[selectedDate].length === 0 ? (
                <div className="text-sm text-gray-400">Không có buổi tập nào</div>
              ) : (
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Lịch hôm nay</div>
                  {events[selectedDate].map((ev, idx) => (
                    <div
                      key={idx}
                      onClick={() => openDetail(selectedDate, idx)}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-2.5 flex gap-3.5 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" style={{ backgroundColor: ev.done ? '#16A34A' : '#2563EB' }} />
                      
                      <div className="flex flex-col items-center min-w-12">
                        <div className="text-xs font-bold text-gray-700 font-semibold">{ev.start}</div>
                        <div className="w-px h-2 bg-gray-300 my-1" />
                        <div className="text-xs text-gray-400">{ev.end}</div>
                      </div>

                      <div className="flex-1 ml-2">
                        <div className="text-sm font-bold text-gray-800 mb-2">{ev.name}</div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{ev.room}</span>
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{ev.curriculum}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                            {ev.student.split(' ').map(w => w[0]).slice(-2).join('')}
                          </div>
                          {ev.student}
                        </div>
                      </div>

                      <div className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap self-start ${ev.done ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                        {ev.done ? 'Đã xong' : 'Sắp diễn ra'}
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
  }

  // Screen 2 & 3 - Session Details
  if ((screen === 2 || screen === 3) && selectedEvent) {
    const ev = selectedEvent.event || events[selectedEvent.key]?.[selectedEvent.idx];
    
    if (!ev) {
      return (
        <div className="flex-1 overflow-y-auto p-7 max-w-3xl mx-auto w-full">
          <button onClick={() => setScreen(1)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-5">
            ← Quay lại lịch dạy
          </button>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-gray-600">Không thể tải dữ liệu buổi tập</div>
          </div>
        </div>
      );
    }
    
    const d = parseInt(selectedEvent.key.split('-')[2]);
    const dayName = dayNames[new Date(year, month, d).getDay()];

    if (screen === 2) {
      return (
        <div className="flex-1 overflow-y-auto p-7 max-w-3xl mx-auto w-full">
          <button onClick={() => setScreen(1)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-5">
            ← Quay lại lịch dạy
          </button>

          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">📅</div>
            <div className="text-sm font-semibold text-gray-700">{dayName}, {String(d).padStart(2, '0')}/04/2026 · {ev.start} – {ev.end}</div>
            <div className="ml-auto text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded">Sắp diễn ra</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
            <div className="pb-4 mb-4 border-b border-gray-100">
              <div className="text-lg font-black text-gray-900">{ev.name}</div>
              <div className="text-xs text-gray-400">Giáo trình: {ev.curriculum} · {ev.room}</div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs font-bold text-gray-400 uppercase">Địa điểm</div>
                <div className="text-sm font-bold text-gray-800 mt-2">{ev.room}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs font-bold text-gray-400 uppercase">Giáo trình</div>
                <div className="text-sm font-bold text-gray-800 mt-2">{ev.curriculum}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs font-bold text-gray-400 uppercase">Bắt đầu</div>
                <div className="text-sm font-bold text-gray-800 mt-2">{ev.start}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs font-bold text-gray-400 uppercase">Kết thúc</div>
                <div className="text-sm font-bold text-gray-800 mt-2">{ev.end}</div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs font-bold text-gray-400 uppercase mb-3">Học viên</div>
              <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-sm font-black text-white">
                  {ev.student.split(' ').map(w => w[0]).slice(-2).join('')}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800">{ev.student}</div>
                  <div className="text-xs text-blue-700">PT 1:1 · {ev.curriculum}</div>
                </div>
                <div className="text-blue-400">→</div>
              </div>
            </div>
          </div>

          <button
            onClick={confirmAttend}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all text-center"
          >
            <span>✓</span>
            <span>Xác nhận đến buổi tập</span>
          </button>
        </div>
      );
    }

    if (screen === 3) {
      const [review, setReview] = useState('');
      const [advice, setAdvice] = useState('');
      const [submitted, setSubmitted] = useState(false);

      return (
        <div className="flex-1 overflow-y-auto p-7 max-w-3xl mx-auto w-full">
          <button onClick={() => setScreen(1)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-5">
            ← Quay lại lịch dạy
          </button>

          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center text-sm">✓</div>
            <div className="text-sm font-semibold text-gray-700">Buổi tập đã hoàn thành · {String(d).padStart(2, '0')}/04/2026</div>
            <div className="ml-auto text-xs font-bold bg-green-50 text-green-700 px-3 py-1 rounded">Đã xong</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-sm font-black text-blue-700">
                {ev.student.split(' ').map(w => w[0]).slice(-2).join('')}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">{ev.student}</div>
                <div className="text-xs text-gray-500">{ev.curriculum} · {ev.room} · {ev.start} – {ev.end}</div>
              </div>
            </div>

            {!submitted ? (
              <>
                <div className="mb-4">
                  <label className="text-sm font-bold text-gray-700">Nhận xét về buổi tập</label>
                  <div className="text-xs text-gray-400 mb-2">Form tập, mức tạ, sức bền, điểm cần cải thiện...</div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Nhập nhận xét về buổi tập hôm nay..."
                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-400 resize-none min-h-24"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm font-bold text-gray-700">Lời khuyên & Dinh dưỡng</label>
                  <div className="text-xs text-gray-400 mb-2">Gợi ý chế độ ăn, nghỉ ngơi, bài tập bổ trợ...</div>
                  <textarea
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    placeholder="Nhập lời khuyên và chế độ dinh dưỡng..."
                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-400 resize-none min-h-24"
                  />
                </div>

                <button
                  onClick={() => {
                    if (review.trim() || advice.trim()) setSubmitted(true);
                  }}
                  className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  Gửi đánh giá buổi tập
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-xl">✓</div>
                <div className="text-base font-black text-gray-800">Đã gửi đánh giá thành công</div>
                <div className="text-sm text-gray-400">Học viên {ev.student} đã nhận được phản hồi của bạn.</div>
                <button
                  onClick={() => setScreen(1)}
                  className="mt-2 px-6 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  ← Về lịch dạy
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  return null;
};

export default TrainerSchedule;
