import React, { useState } from 'react';
import { toast } from 'sonner';
import { X, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import useTrainerStore from '@/store/useTrainerStore';

// ─── Absence Modal ─────────────────────────────────────────────────────────────
const AbsenceModal = ({ student, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Báo cáo nghỉ</h3>
              <p className="text-xs text-gray-500 mt-0.5">Học viên: {student}</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-2">
            Lý do vắng mặt
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do vắng mặt..."
            rows={4}
            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-400 resize-none transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button
            onClick={() => {
              if (!reason.trim()) { toast.error('Vui lòng nhập lý do vắng mặt'); return; }
              onConfirm(reason.trim());
            }}
            className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700 transition-colors"
          >
            Xác nhận báo nghỉ
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Attendance Status Badge ──────────────────────────────────────────────────
const AttendanceBadge = ({ ev }) => {
  if (ev.absent)    return <span className="text-xs font-bold bg-red-50   text-red-700   px-2.5 py-1 rounded whitespace-nowrap">Vắng mặt</span>;
  if (ev.done)      return <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded whitespace-nowrap">Đã xong</span>;
  if (ev.confirmed) return <span className="text-xs font-bold bg-teal-50  text-teal-700  px-2.5 py-1 rounded whitespace-nowrap">Đã xác nhận</span>;
  return              <span className="text-xs font-bold bg-blue-50  text-blue-700  px-2.5 py-1 rounded whitespace-nowrap">Sắp diễn ra</span>;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const DAY_NAMES = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const pad2 = (n) => String(n).padStart(2, '0');

const makeDateKey = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;

function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay();
  const offset = first === 0 ? 6 : first - 1; // Mon-first offset
  const dim = new Date(year, month + 1, 0).getDate();
  const prev = new Date(year, month, 0).getDate();
  const days = [];
  for (let i = offset - 1; i >= 0; i--) days.push({ day: prev - i, isCurrentMonth: false });
  for (let d = 1; d <= dim; d++) days.push({ day: d, isCurrentMonth: true });
  const tot = offset + dim;
  const rem = tot % 7 === 0 ? 0 : 7 - (tot % 7);
  for (let i = 1; i <= rem; i++) days.push({ day: i, isCurrentMonth: false });
  return days;
}

const MONTH_NAMES = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

// ─── Main Component ───────────────────────────────────────────────────────────
const TrainerSchedule = () => {
  const scheduleEvents = useTrainerStore((s) => s.scheduleEvents);
  const confirmAttendance = useTrainerStore((s) => s.confirmAttendance);
  const reportAbsence = useTrainerStore((s) => s.reportAbsence);

  // Start at April 2026 (demo reference month)
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(3); // 0-indexed; 3 = April

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // screen: 1=calendar, 2=session detail (upcoming), 3=session detail (done)
  const [screen, setScreen] = useState(1);
  const [absenceModal, setAbsenceModal] = useState(false);
  const [reviewData, setReviewData] = useState({ review: '', advice: '' });
  const [submitted, setSubmitted] = useState(false);

  const calendarDays = buildCalendar(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelectedDate(null);
  };

  const selectDay = (d) => {
    setSelectedDate(makeDateKey(calYear, calMonth, d));
    setScreen(1);
  };

  const openDetail = (key, idx) => {
    const ev = scheduleEvents[key]?.[idx];
    if (!ev) { toast.error('Không thể tải dữ liệu buổi tập'); return; }
    setSelectedEvent({ key, idx, event: ev });
    setSubmitted(false);
    setScreen(ev.done || ev.absent ? 3 : 2);
  };

  const handleConfirmAttend = () => {
    if (!selectedEvent) return;
    confirmAttendance(selectedEvent.key, selectedEvent.idx);
    toast.success('Xác nhận thành công', { description: 'Đã xác nhận tham gia buổi tập' });
    setScreen(1);
  };

  const handleAbsenceConfirm = (reason) => {
    reportAbsence(selectedEvent.key, selectedEvent.idx, reason);
    setAbsenceModal(false);
    toast.warning('Đã báo cáo nghỉ', { description: `Lý do: ${reason}` });
    setScreen(1);
  };

  // ── Total stats across all events in the store ────────────────────────────
  const allEvents = Object.values(scheduleEvents).flat();
  const totalSessions = allEvents.length;
  const doneSessions = allEvents.filter(e => e.done || e.confirmed).length;
  const absentSessions = allEvents.filter(e => e.absent).length;

  // ── Screen 1 – Calendar ────────────────────────────────────────────────────
  if (screen === 1) {
    return (
      <div className="flex flex-col flex-1 bg-gray-50 p-6 max-w-5xl mx-auto w-full">
        {/* Calendar */}
        <div className="bg-white border border-gray-200 flex flex-col rounded-xl mb-6">
          <div className="p-5">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-sm font-bold text-gray-800">
                {MONTH_NAMES[calMonth]}, {calYear}
              </div>
              <button
                onClick={nextMonth}
                className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {DAYS.map((day) => (
                <div key={day} className="text-xs font-bold text-gray-400 text-center py-2">{day}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayObj, idx) => {
                const key = dayObj.isCurrentMonth ? makeDateKey(calYear, calMonth, dayObj.day) : null;
                const evs = key ? scheduleEvents[key] || [] : [];
                const isSelected = selectedDate === key;
                // Mark "today" as April 17 2026 for the demo
                const isToday = dayObj.isCurrentMonth && calYear === 2026 && calMonth === 3 && dayObj.day === 17;
                return (
                  <div
                    key={idx}
                    onClick={() => dayObj.isCurrentMonth && selectDay(dayObj.day)}
                    className={`h-14 flex flex-col items-center justify-center rounded text-xs cursor-pointer transition-all ${
                      isSelected ? 'bg-blue-600 text-white font-bold'
                      : isToday ? 'ring-2 ring-blue-400 text-blue-700 font-bold hover:bg-blue-50'
                      : dayObj.isCurrentMonth ? 'hover:bg-gray-100 text-gray-700'
                      : 'text-gray-300 cursor-default'
                    }`}
                  >
                    <span className="text-sm font-semibold">{dayObj.day}</span>
                    {evs.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {evs.slice(0, 4).map((e, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${
                            e.absent ? 'bg-red-500' : e.done ? 'bg-green-600' : e.confirmed ? 'bg-teal-500' : 'bg-blue-400'
                          }`} />
                        ))}
                        {evs.length > 4 && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-100 p-4 grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-bold text-gray-400 uppercase mb-1">Tổng buổi</div>
              <div className="text-xl font-black text-gray-800">{totalSessions} <span className="text-xs text-gray-400">buổi</span></div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-bold text-gray-400 uppercase mb-1">Đã hoàn thành</div>
              <div className="text-xl font-black text-gray-800">{doneSessions} <span className="text-xs text-gray-400">buổi</span></div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-bold text-gray-400 uppercase mb-1">Vắng mặt</div>
              <div className="text-xl font-black text-red-500">
                {absentSessions}
                <span className="text-xs text-gray-400"> buổi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Event list for selected date */}
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
                  {DAY_NAMES[new Date(calYear, calMonth, parseInt(selectedDate.split('-')[2])).getDay()]},{' '}
                  {selectedDate.split('-')[2]}/{pad2(calMonth + 1)}/{calYear}
                </div>
                {scheduleEvents[selectedDate]?.length > 0 && (
                  <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {scheduleEvents[selectedDate].length} buổi
                  </div>
                )}
              </div>
              {!scheduleEvents[selectedDate] || scheduleEvents[selectedDate].length === 0 ? (
                <div className="text-sm text-gray-400">Không có buổi tập nào</div>
              ) : (
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Lịch ngày này</div>
                  {scheduleEvents[selectedDate].map((ev, idx) => (
                    <div
                      key={idx}
                      onClick={() => openDetail(selectedDate, idx)}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-2.5 flex gap-3.5 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l" style={{
                        backgroundColor: ev.absent ? '#EF4444' : ev.done ? '#16A34A' : ev.confirmed ? '#0D9488' : '#2563EB'
                      }} />
                      <div className="flex flex-col items-center min-w-12">
                        <div className="text-xs font-bold text-gray-700">{ev.start}</div>
                        <div className="w-px h-2 bg-gray-300 my-1" />
                        <div className="text-xs text-gray-400">{ev.end}</div>
                      </div>
                      <div className="flex-1 ml-2">
                        <div className="text-sm font-bold text-gray-800 mb-1">{ev.name}</div>
                        {ev.totalSessions && (
                          <div className="text-xs text-indigo-600 font-semibold mb-1">
                            Buổi {ev.sessionNumber}/{ev.totalSessions} · {ev.curriculum}
                          </div>
                        )}
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
                      <AttendanceBadge ev={ev} />
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

  // ── Screens 2 & 3 ─────────────────────────────────────────────────────────
  if (!selectedEvent) return null;
  const ev = scheduleEvents[selectedEvent.key]?.[selectedEvent.idx];
  if (!ev) return null;
  const parts = selectedEvent.key.split('-');
  const evYear = parseInt(parts[0]);
  const evMonth = parseInt(parts[1]) - 1;
  const evDay = parseInt(parts[2]);
  const dayName = DAY_NAMES[new Date(evYear, evMonth, evDay).getDay()];

  const isUpcoming = screen === 2;
  return (
    <>
      {absenceModal && (
        <AbsenceModal
          student={ev.student}
          onConfirm={handleAbsenceConfirm}
          onCancel={() => setAbsenceModal(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto p-7 max-w-3xl mx-auto w-full">
        <button onClick={() => setScreen(1)} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-5 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Quay lại lịch dạy
        </button>

        {/* Status header */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-2.5 mb-5">
          <div className={`w-8 h-8 rounded flex items-center justify-center text-sm ${ev.absent ? 'bg-red-50' : ev.done ? 'bg-green-50' : 'bg-blue-50'}`}>
            {ev.absent ? '🚫' : ev.done ? '✓' : '📅'}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-700">
              {ev.absent ? 'Vắng mặt · ' : ev.done ? 'Hoàn thành · ' : ''}{dayName}, {pad2(evDay)}/{pad2(evMonth + 1)}/{evYear} · {ev.start} – {ev.end}
            </div>
            {ev.totalSessions && (
              <div className="text-xs text-indigo-600 font-semibold mt-0.5">
                Buổi {ev.sessionNumber}/{ev.totalSessions} trong chương trình
              </div>
            )}
          </div>
          <div className="ml-auto"><AttendanceBadge ev={ev} /></div>
        </div>

        {/* Session detail card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
          <div className="pb-4 mb-4 border-b border-gray-100">
            <div className="text-lg font-black text-gray-900">{ev.name}</div>
            <div className="text-xs text-gray-400">Giáo trình: {ev.curriculum} · {ev.room}</div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {[
              ['Địa điểm', ev.room],
              ['Giáo trình', ev.curriculum],
              ['Bắt đầu', ev.start],
              ['Kết thúc', ev.end],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs font-bold text-gray-400 uppercase">{label}</div>
                <div className="text-sm font-bold text-gray-800 mt-2">{value}</div>
              </div>
            ))}
          </div>
          {/* Student card */}
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
              {ev.totalSessions && (
                <div className="text-right">
                  <div className="text-lg font-black text-indigo-600">{ev.sessionNumber}</div>
                  <div className="text-xs text-gray-400">/ {ev.totalSessions} buổi</div>
                </div>
              )}
            </div>
          </div>
          {/* Absence reason */}
          {ev.absent && ev.absenceReason && (
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="text-xs font-bold text-red-400 uppercase mb-2">Lý do vắng mặt</div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">{ev.absenceReason}</div>
            </div>
          )}
        </div>

        {/* Action buttons / review form */}
        {isUpcoming ? (
          <div className="flex gap-3">
            <button
              onClick={() => setAbsenceModal(true)}
              className="flex-1 py-3.5 bg-white border-2 border-orange-200 text-orange-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-50 transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              Báo cáo nghỉ
            </button>
            <button
              onClick={handleConfirmAttend}
              className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Xác nhận đến buổi tập
            </button>
          </div>
        ) : (
          /* Done session – review + advice */
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
                {[
                  { key: 'review', label: 'Nhận xét về buổi tập', hint: 'Form tập, mức tạ, sức bền, điểm cần cải thiện...', placeholder: 'Nhập nhận xét về buổi tập hôm nay...' },
                  { key: 'advice', label: 'Lời khuyên & Dinh dưỡng', hint: 'Gợi ý chế độ ăn, nghỉ ngơi, bài tập bổ trợ...', placeholder: 'Nhập lời khuyên và chế độ dinh dưỡng...' },
                ].map((f) => (
                  <div key={f.key} className="mb-4">
                    <label className="text-sm font-bold text-gray-700">{f.label}</label>
                    <div className="text-xs text-gray-400 mb-2">{f.hint}</div>
                    <textarea
                      value={reviewData[f.key]}
                      onChange={(e) => setReviewData((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-400 resize-none min-h-24"
                    />
                  </div>
                ))}
                <button
                  onClick={() => { if (reviewData.review.trim() || reviewData.advice.trim()) setSubmitted(true); }}
                  className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  Gửi đánh giá buổi tập
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-xl">✓</div>
                <div className="text-base font-black text-gray-800">Đã gửi đánh giá thành công</div>
                <div className="text-sm text-gray-400">Học viên {ev.student} đã nhận được phản hồi.</div>
                <button onClick={() => setScreen(1)} className="mt-2 px-6 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  ← Về lịch dạy
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TrainerSchedule;
