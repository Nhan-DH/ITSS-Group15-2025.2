import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, AlertCircle, Loader } from 'lucide-react';
import Button from '@/components/Common/Button';
import Badge from '@/components/Common/Badge';

const ScheduleCalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date('2026-04-13'));
    const [selectedDate, setSelectedDate] = useState('2026-04-13');
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scheduleMockData, setScheduleMockData] = useState({});

    // Fetch all schedule events from API on component mount
    useEffect(() => {
        const fetchScheduleEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:8080/api/training-bookings/schedule/events', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch schedule events: ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log('Schedule events data:', data);
                
                // Transform API data to match display format
                const transformedData = transformScheduleData(data);
                setAllEvents(data || []);
                setScheduleMockData(transformedData);
            } catch (err) {
                console.error('Error fetching schedule events:', err);
                setError(err.message);
                setAllEvents([]);
                setScheduleMockData({});
            } finally {
                setLoading(false);
            }
        };

        fetchScheduleEvents();
    }, []);

    // Transform API data to display format
    const transformScheduleData = (events) => {
        const grouped = {};
        
        if (!events || !Array.isArray(events)) return grouped;
        
        events.forEach(event => {
            if (!event.session_time) return;
            
            const eventDate = new Date(event.session_time).toISOString().split('T')[0];
            
            if (!grouped[eventDate]) {
                grouped[eventDate] = [];
            }
            
            const timeStr = new Date(event.session_time).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            
            grouped[eventDate].push({
                id: event.id,
                session_id: event.session_id,
                time: timeStr,
                pt: event.pt_name || 'Không xác định',
                pt_email: event.pt_email,
                pt_phone: event.pt_phone,
                member: event.member_name || 'Không xác định',
                member_email: event.member_email,
                member_phone: event.member_phone,
                facility: event.facility_name || 'Không xác định',
                facility_type: event.facility_type,
                status: event.attendance_status === 'Present' ? 'booked' : 'available',
                attendance_status: event.attendance_status,
                booking_status: event.booking_status,
                training_plan_note: event.training_plan_note,
                pt_feedback: event.pt_feedback,
                requested_schedule: event.requested_schedule,
                ...event
            });
        });
        
        return grouped;
    };

    // Helper functions
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const formatDate = (date) => date.toISOString().split('T')[0];

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthYear = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const todaySchedules = (scheduleMockData[selectedDate] || []).sort((a, b) => a.time.localeCompare(b.time));

    const getStatusColor = (attendance_status) => {
        if (attendance_status === 'Present') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        if (attendance_status === 'Absent') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    };

    const getStatusLabel = (attendance_status) => {
        if (attendance_status === 'Present') return 'Đã tham gia';
        if (attendance_status === 'Absent') return 'Vắng';
        return 'Chưa bắt đầu';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Lịch PT</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Xem và quản lý lịch tập của huấn luyện viên
                    </p>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
                    <p className="text-sm text-red-700 dark:text-red-400">Lỗi: {error}</p>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Calendar */}
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 lg:col-span-1">
                    {/* Calendar Header */}
                    <div className="border-b border-gray-100 p-4 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{monthYear}</h3>
                            <div className="flex gap-2">
                                <button onClick={previousMonth} className="p-1 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800">
                                    <ChevronLeft size={18} />
                                </button>
                                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Week days */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map(day => (
                                <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => {
                                const dateStr = day ? formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) : null;
                                const hasSchedule = dateStr && scheduleMockData[dateStr] && scheduleMockData[dateStr].length > 0;
                                const isSelected = dateStr === selectedDate;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (dateStr) setSelectedDate(dateStr);
                                        }}
                                        className={`h-8 rounded text-xs font-medium transition-colors ${day ? 'cursor-pointer' : 'cursor-default'
                                            } ${isSelected
                                                ? 'bg-blue-600 text-white dark:bg-blue-500'
                                                : hasSchedule
                                                    ? 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-400'
                                                    : day
                                                        ? 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                                        : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="p-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Chú thích:</p>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-green-500"></div>
                                <span className="text-gray-600 dark:text-gray-400">Đã tham gia</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-blue-500"></div>
                                <span className="text-gray-600 dark:text-gray-400">Chưa bắt đầu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-red-500"></div>
                                <span className="text-gray-600 dark:text-gray-400">Vắng</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule List */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <div className="border-b border-gray-100 p-4 dark:border-gray-800">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Lịch {new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </h3>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <Loader className="inline-block animate-spin text-blue-600 mb-2" size={24} />
                                    <p className="text-gray-500 dark:text-gray-400">Đang tải lịch...</p>
                                </div>
                            ) : todaySchedules.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">Không có lịch nào trong ngày</p>
                                </div>
                            ) : (
                                todaySchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        onClick={() => setSelectedSchedule(selectedSchedule?.id === schedule.id ? null : schedule)}
                                        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4 flex-1">
                                                <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 px-3 py-2 text-sm font-semibold text-purple-700 dark:text-purple-400 min-w-fit">
                                                    {schedule.time}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white">{schedule.pt}</h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{schedule.member}</p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Badge className={getStatusColor(schedule.attendance_status)}>
                                                            {getStatusLabel(schedule.attendance_status)}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {schedule.facility}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {schedule.attendance_status === 'Absent' && (
                                                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                                            )}
                                        </div>

                                        {/* Expanded view */}
                                        {selectedSchedule?.id === schedule.id && (
                                            <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700 space-y-3">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Giờ</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.time}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Huấn luyện viên</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.pt}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Hội viên</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.member}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Cơ sở tập</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.facility}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Điện thoại PT</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.pt_phone || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Điện thoại hội viên</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.member_phone || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                {schedule.training_plan_note && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Ghi chú kế hoạch</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.training_plan_note}</p>
                                                    </div>
                                                )}

                                                {schedule.pt_feedback && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Nhận xét của PT</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white">{schedule.pt_feedback}</p>
                                                    </div>
                                                )}

                                                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                                    <Button variant="outline" size="sm">Chỉnh sửa</Button>
                                                    <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400">Hủy lịch</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hành động nhanh</h3>
                <div className="flex flex-wrap gap-3">
                    <Button>
                        <Clock size={16} />
                        Thêm lịch mới
                    </Button>
                    <Button variant="outline">Xuất lịch</Button>
                    <Button variant="outline">Gửi thông báo</Button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleCalendarView;
