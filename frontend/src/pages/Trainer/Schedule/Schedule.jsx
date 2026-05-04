import React, { useState, useMemo } from 'react';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrainerSchedule = () => {
  const navigate = useNavigate();
  const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const dayNames = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  const [activeTab, setActiveTab] = useState('mySchedule');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));
  const [selectedDate, setSelectedDate] = useState('2026-04-17');
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Trainer's registered slots
  const [registeredSlots, setRegisteredSlots] = useState({
    '2026-04-17': [
      { id: 'slot-1', startTime: '08:00', endTime: '09:00', type: 'Strength Training', room: 'Phòng B1', status: 'Đã xác nhận', memberName: 'Nguyễn Tuấn A', memberPhone: '0901 234 567' },
      { id: 'slot-2', startTime: '10:00', endTime: '11:00', type: 'HIIT', room: 'Phòng A2', status: 'Đã xác nhận', memberName: 'Lê Thị B', memberPhone: '0902 345 678' },
    ],
    '2026-04-18': [
      { id: 'slot-3', startTime: '14:00', endTime: '15:00', type: 'Yoga', room: 'Phòng C1', status: 'Đã xác nhận', memberName: 'Trần Văn C', memberPhone: '0903 456 789' },
    ],
    '2026-04-20': [
      { id: 'slot-4', startTime: '07:00', endTime: '08:00', type: 'Cardio', room: 'Studio A', status: 'Đã xác nhận', memberName: 'Phạm Thị D', memberPhone: '0904 567 890' },
    ],
    '2026-04-22': [
      { id: 'slot-5', startTime: '09:00', endTime: '10:00', type: 'CrossFit', room: 'Studio B', status: 'Trống' },
      { id: 'slot-6', startTime: '15:00', endTime: '16:00', type: 'Pilates', room: 'Phòng A1', status: 'Có yêu cầu' },
    ],
    '2026-04-24': [
      { id: 'slot-7', startTime: '11:00', endTime: '12:00', type: 'Core Training', room: 'Phòng B2', status: 'Đã xác nhận', memberName: 'Hoàng Văn E', memberPhone: '0905 678 901' },
    ],
  });

  // Member requests
  const [memberRequests, setMemberRequests] = useState({
    '2026-04-22': [
      { 
        id: 'req-1', 
        slotId: 'slot-6',
        memberName: 'Nguyễn Tuấn A',
        memberPhone: '0901 234 567',
        curriculum: 'Pilates',
        notes: 'Muốn tập buổi chiều để tiện theo lịch làm việc',
        status: 'Chờ xác nhận',
        startTime: '15:00',
        endTime: '16:00',
        room: 'Phòng A1'
      },
    ],
    '2026-04-25': [
      { 
        id: 'req-2', 
        slotId: 'slot-new',
        memberName: 'Lê Thị B',
        memberPhone: '0902 345 678',
        curriculum: 'Yoga',
        notes: 'Muốn tham gia lớp sáng',
        status: 'Chờ xác nhận',
        startTime: '06:00',
        endTime: '07:00',
        room: 'Phòng C1'
      },
    ],
    '2026-04-27': [
      { 
        id: 'req-3', 
        slotId: 'slot-confirmed',
        memberName: 'Trần Văn C',
        memberPhone: '0903 456 789',
        curriculum: 'Boxing',
        notes: '',
        status: 'Đã xác nhận',
        startTime: '18:00',
        endTime: '19:00',
        room: 'Studio A'
      },
      { 
        id: 'req-4', 
        slotId: 'slot-denied',
        memberName: 'Phạm Thị D',
        memberPhone: '0904 567 890',
        curriculum: 'CrossFit',
        notes: 'Khung giờ này ko phù hợp',
        status: 'Từ chối',
        startTime: '10:00',
        endTime: '11:00',
        room: 'Studio B',
        denyReason: 'Khung giờ này đã kín lịch, vui lòng chọn thời gian khác'
      },
    ],
  });

  // Form state for creating new slots
  const [slotForm, setSlotForm] = useState({
    startTime: '07:00',
    type: 'Yoga',
    room: '',
  });

  const [showSlotForm, setShowSlotForm] = useState(false);
  const [denialReason, setDenialReason] = useState('');
  const [showDenialForm, setShowDenialForm] = useState(null);

  // Helper functions
  const dateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

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

  const selectDay = (day) => {
    const key = dateKey(year, month, day);
    setSelectedDate(key);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  const getCalendarDotClass = (dateKey) => {
    if (activeTab === 'mySchedule') {
      const slots = registeredSlots[dateKey] || [];
      return slots.some(s => s.status === 'Đã xác nhận') ? 'bg-green-500' : slots.length > 0 ? 'bg-blue-400' : null;
    }
    if (activeTab === 'registerSlot') {
      const slots = registeredSlots[dateKey] || [];
      if (slots.some(s => s.status === 'Đã xác nhận')) return 'bg-green-500';
      if (slots.some(s => s.status === 'Có yêu cầu')) return 'bg-yellow-400';
      if (slots.some(s => s.status === 'Trống')) return 'bg-blue-400';
      return null;
    }
    if (activeTab === 'memberRequests') {
      const requests = memberRequests[dateKey] || [];
      if (requests.some(r => r.status === 'Chờ xác nhận')) return 'bg-yellow-400';
      if (requests.some(r => r.status === 'Đã xác nhận')) return 'bg-green-500';
      if (requests.some(r => r.status === 'Từ chối')) return 'bg-red-400';
      return null;
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'Đã xác nhận') {
      return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    }
    if (status === 'Chờ xác nhận') {
      return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    }
    if (status === 'Từ chối') {
      return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  const getAccentColor = (status) => {
    if (status === 'Đã xác nhận') return '#16A34A';
    if (status === 'Chờ xác nhận') return '#EAB308';
    if (status === 'Từ chối') return '#EF4444';
    if (status === 'Có yêu cầu') return '#EAB308';
    if (status === 'Trống') return '#6B7280';
    return '#9CA3AF';
  };

  const selectedDateObject = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;
  const selectedSlots = selectedDate ? registeredSlots[selectedDate] || [] : [];
  const selectedRequests = selectedDate ? memberRequests[selectedDate] || [] : [];

  const handleCreateSlot = (e) => {
    e.preventDefault();
    if (!slotForm.room.trim()) {
      alert('Vui lòng nhập tên phòng');
      return;
    }

    const endTime = String(parseInt(slotForm.startTime.split(':')[0]) + 1).padStart(2, '0') + ':00';
    const newSlot = {
      id: `slot-${Date.now()}`,
      startTime: slotForm.startTime,
      endTime: endTime,
      type: slotForm.type,
      room: slotForm.room,
      status: 'Trống',
    };

    setRegisteredSlots(prev => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newSlot]
    }));

    setSlotForm({ startTime: '07:00', type: 'Yoga', room: '' });
    setShowSlotForm(false);
  };

  const handleConfirmRequest = (requestId) => {
    const request = selectedRequests.find(r => r.id === requestId);
    if (!request) return;

    setMemberRequests(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map(r => 
        r.id === requestId ? { ...r, status: 'Đã xác nhận' } : r
      )
    }));

    // Update slot status to Đã xác nhận
    setRegisteredSlots(prev => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] || []).map(s =>
        s.id === request.slotId ? { 
          ...s, 
          status: 'Đã xác nhận',
          memberName: request.memberName,
          memberPhone: request.memberPhone
        } : s
      )
    }));
  };

  const handleDenyRequest = (requestId) => {
    if (!denialReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    setMemberRequests(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map(r => 
        r.id === requestId ? { ...r, status: 'Từ chối', denyReason: denialReason } : r
      )
    }));

    // Reset slot to Trống
    setRegisteredSlots(prev => ({
      ...prev,
      [selectedDate]: (prev[selectedDate] || []).map(s =>
        s.id === memberRequests[selectedDate]?.find(r => r.id === requestId)?.slotId ? { ...s, status: 'Trống' } : s
      )
    }));

    setDenialReason('');
    setShowDenialForm(null);
  };

  const isDateAt7DaysAdvance = (dateStr) => {
    const targetDate = new Date(dateStr);
    const today = new Date('2026-04-10');
    const daysFromNow = (targetDate - today) / (1000 * 60 * 60 * 24);
    return daysFromNow >= 7;
  };

  const workoutTypes = ['Yoga', 'HIIT', 'Cardio', 'Strength Training', 'Pilates', 'Boxing', 'CrossFit', 'Core Training', 'Back Training', 'Leg Training'];

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full pb-20">
      <button
        onClick={() => navigate('/trainer/dashboard')}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </button>

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
              const dotClass = key ? getCalendarDotClass(key) : null;
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
                  {dotClass && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${dotClass}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 p-4 flex gap-2">
          <button
            onClick={() => setActiveTab('mySchedule')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'mySchedule'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Lịch của tôi
          </button>
          <button
            onClick={() => setActiveTab('registerSlot')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'registerSlot'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Đăng ký lịch
          </button>
          <button
            onClick={() => setActiveTab('memberRequests')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              activeTab === 'memberRequests'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Yêu cầu hội viên
          </button>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 p-6">
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-3xl">📅</div>
              <div className="text-sm text-gray-400 dark:text-gray-500">Chọn một ngày để xem lịch</div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {selectedDateObject ? dayNames[selectedDateObject.getDay()] : ''}, {selectedDateObject ? selectedDateObject.getDate() : ''}/
                  {selectedDateObject ? String(selectedDateObject.getMonth() + 1).padStart(2, '0') : ''}/
                  {selectedDateObject ? selectedDateObject.getFullYear() : ''}
                </div>
              </div>

              {/* Tab 1: My Schedule */}
              {activeTab === 'mySchedule' && (
                <div>
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                    Lịch dạy đã xác nhận
                  </div>
                  {selectedSlots.filter(s => s.status === 'Đã xác nhận').length === 0 ? (
                    <div className="text-sm text-gray-400 dark:text-gray-500">Không có lịch dạy nào</div>
                  ) : (
                    <div className="space-y-3">
                      {selectedSlots.filter(s => s.status === 'Đã xác nhận').map((slot, idx) => (
                        <div
                          key={slot.id}
                          className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex gap-3.5 relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: getAccentColor(slot.status) }} />
                          
                          <div className="flex flex-col items-center min-w-12">
                            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 font-semibold">{slot.startTime}</div>
                            <div className="w-px h-2 bg-gray-300 dark:bg-gray-600 my-1" />
                            <div className="text-xs text-gray-400 dark:text-gray-500">{slot.endTime}</div>
                          </div>

                          <div className="flex-1 ml-2">
                            <div className="text-sm font-bold text-gray-800 dark:text-white mb-2">{slot.type}</div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{slot.room}</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              📞 {slot.memberName} · {slot.memberPhone}
                            </div>
                          </div>

                          <div className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap self-start ${getStatusBadgeClass(slot.status)}`}>
                            {slot.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Register Slot */}
              {activeTab === 'registerSlot' && (
                <div>
                  {!isDateAt7DaysAdvance(selectedDate) && (
                    <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
                      ⚠️ Chỉ có thể đăng ký lịch từ 7 ngày trở lên. Vui lòng chọn ngày khác.
                    </div>
                  )}

                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                    Lịch đã đăng ký
                  </div>
                  {selectedSlots.length === 0 ? (
                    <div className="text-sm text-gray-400 dark:text-gray-500 mb-6">Chưa có lịch nào được đăng ký</div>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {selectedSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex gap-3.5 relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: getAccentColor(slot.status) }} />
                          
                          <div className="flex flex-col items-center min-w-12">
                            <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{slot.startTime}</div>
                            <div className="w-px h-2 bg-gray-300 dark:bg-gray-600 my-1" />
                            <div className="text-xs text-gray-400 dark:text-gray-500">{slot.endTime}</div>
                          </div>

                          <div className="flex-1 ml-2">
                            <div className="text-sm font-bold text-gray-800 dark:text-white mb-2">{slot.type}</div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{slot.room}</span>
                            </div>
                            {slot.status === 'Đã xác nhận' && slot.memberName && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Hội viên: {slot.memberName}
                              </div>
                            )}
                          </div>

                          <div className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap self-start ${getStatusBadgeClass(slot.status)}`}>
                            {slot.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isDateAt7DaysAdvance(selectedDate) && (
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                      {!showSlotForm ? (
                        <button
                          onClick={() => setShowSlotForm(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                        >
                          <Plus className="h-4 w-4" />
                          Thêm ca mới
                        </button>
                      ) : (
                        <form onSubmit={handleCreateSlot} className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Giờ bắt đầu</label>
                            <input
                              type="time"
                              value={slotForm.startTime}
                              onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                              className="w-full mt-1 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Loại lớp</label>
                            <select
                              value={slotForm.type}
                              onChange={(e) => setSlotForm({ ...slotForm, type: e.target.value })}
                              className="w-full mt-1 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {workoutTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Phòng</label>
                            <input
                              type="text"
                              placeholder="Nhập tên phòng"
                              value={slotForm.room}
                              onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                              className="w-full mt-1 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                            >
                              Tạo ca
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowSlotForm(false)}
                              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors font-semibold text-sm"
                            >
                              Hủy
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Member Requests */}
              {activeTab === 'memberRequests' && (
                <div>
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                    Yêu cầu từ hội viên
                  </div>
                  {selectedRequests.length === 0 ? (
                    <div className="text-sm text-gray-400 dark:text-gray-500">Chưa có yêu cầu nào</div>
                  ) : (
                    <div className="space-y-3">
                      {selectedRequests.map((request) => (
                        <div
                          key={request.id}
                          className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex gap-3.5 relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: getAccentColor(request.status) }} />
                          
                          <div className="flex flex-col items-center min-w-12">
                            <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{request.startTime}</div>
                            <div className="w-px h-2 bg-gray-300 dark:bg-gray-600 my-1" />
                            <div className="text-xs text-gray-400 dark:text-gray-500">{request.endTime}</div>
                          </div>

                          <div className="flex-1 ml-2">
                            <div className="text-sm font-bold text-gray-800 dark:text-white mb-1">{request.memberName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">📞 {request.memberPhone}</div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{request.room}</span>
                              <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">{request.curriculum}</span>
                            </div>
                            {request.notes && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 italic">Ghi chú: {request.notes}</div>
                            )}
                            {request.denyReason && (
                              <div className="text-xs text-red-600 dark:text-red-400 italic">Lý do từ chối: {request.denyReason}</div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 items-end">
                            <div className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap ${getStatusBadgeClass(request.status)}`}>
                              {request.status}
                            </div>
                            {request.status === 'Chờ xác nhận' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleConfirmRequest(request.id)}
                                  className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-semibold"
                                >
                                  Xác nhận
                                </button>
                                <button
                                  onClick={() => setShowDenialForm(request.id)}
                                  className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-semibold"
                                >
                                  Từ chối
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showDenialForm && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg">
                      <label className="text-xs font-bold text-red-700 dark:text-red-300 uppercase">Lý do từ chối</label>
                      <textarea
                        value={denialReason}
                        onChange={(e) => setDenialReason(e.target.value)}
                        placeholder="Nhập lý do từ chối..."
                        className="w-full mt-2 h-20 rounded-lg border border-red-300 dark:border-red-900 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleDenyRequest(showDenialForm)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
                        >
                          Xác nhận từ chối
                        </button>
                        <button
                          onClick={() => {
                            setShowDenialForm(null);
                            setDenialReason('');
                          }}
                          className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors font-semibold text-sm"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerSchedule;
