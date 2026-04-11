import React, { useState } from 'react';
import { Award, Briefcase, Ruler } from 'lucide-react';

const TrainerProfile = () => {
  const [schedule, setSchedule] = useState([
    { day: 'Thứ 2', slots: ['6:00 – 7:00', '8:00 – 9:00', '17:00 – 18:00'] },
    { day: 'Thứ 3', slots: ['9:00 – 10:00', '17:00 – 18:00', '19:00 – 20:00'] },
    { day: 'Thứ 4', slots: ['6:00 – 7:00', '8:00 – 9:00', '15:00 – 16:00'] },
    { day: 'Thứ 5', slots: ['18:00 – 19:00', '20:00 – 21:00'] },
    { day: 'Thứ 6', slots: ['6:00 – 7:00', '8:00 – 9:00', '17:00 – 18:00'] },
    { day: 'Thứ 7', slots: ['7:00 – 8:00', '9:00 – 10:00'] },
    { day: 'Chủ nhật', slots: [] },
  ]);

  const [removedSlots, setRemovedSlots] = useState({});

  const toggleSlot = (dayIndex, slotIndex) => {
    const key = `${dayIndex}-${slotIndex}`;
    setRemovedSlots((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const addSlot = (dayIndex) => {
    const time = prompt('Nhập ca rảnh (vd: 10:00 – 11:00)');
    if (time && time.trim()) {
      setSchedule((prev) => {
        const updated = [...prev];
        updated[dayIndex].slots = [...updated[dayIndex].slots, time.trim()];
        return updated;
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-full">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Thông tin cá nhân</h1>
        <p className="text-sm text-gray-600 mb-6">Hồ sơ và thông tin chi tiết của huấn luyện viên.</p>

        {/* Avatar + Basic Info Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Avatar Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-semibold text-blue-600 border-2 border-blue-200 mb-4">
              TR
            </div>
            <div className="text-center">
              <div className="text-base font-semibold text-gray-900">Trần Minh Khoa</div>
              <div className="text-xs text-gray-600 mt-0.5">Năm sinh: 1995</div>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                TRAINER
              </span>
            </div>
          </div>

          {/* Basic Info Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Thông tin cơ bản
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-600">Họ và tên</span>
                <span className="text-sm font-medium text-gray-900">Trần Minh Khoa</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-600">Năm sinh</span>
                <span className="text-sm font-medium text-gray-900">1995</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-600">Số điện thoại</span>
                <span className="text-sm font-medium text-gray-900">0912 345 678</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-600">Email</span>
                <span className="text-sm font-medium text-gray-900">khoa.tran@activegym.vn</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Chuyên môn</span>
                <span className="text-sm font-medium text-gray-900">Strength & Conditioning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Awards, Experience, Measurements Section */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Awards Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Giải thưởng
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center text-sm flex-shrink-0">
                  🥇
                </div>
                <div>
                  <div className="text-sm text-gray-900">HCV Men's Physique</div>
                  <div className="text-xs text-gray-600">VNBF 2023</div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center text-sm flex-shrink-0">
                  🥈
                </div>
                <div>
                  <div className="text-sm text-gray-900">Á quân Classic Bodybuilding</div>
                  <div className="text-xs text-gray-600">WBPF 2022</div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center text-sm flex-shrink-0">
                  🏆
                </div>
                <div>
                  <div className="text-sm text-gray-900">Top 3 PT of the Year</div>
                  <div className="text-xs text-gray-600">ActiveGym 2024</div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Kinh nghiệm
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                <div>
                  <div className="text-sm text-gray-900">Head PT — ActiveGym Hà Nội</div>
                  <div className="text-xs text-gray-600">2022 – nay · 3 năm</div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-300 mt-1.5 flex-shrink-0"></div>
                <div>
                  <div className="text-sm text-gray-900">Personal Trainer — California Fitness</div>
                  <div className="text-xs text-gray-600">2019 – 2022 · 3 năm</div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-300 mt-1.5 flex-shrink-0"></div>
                <div>
                  <div className="text-sm text-gray-900">Chứng chỉ ACE-CPT, FMS Level 1</div>
                  <div className="text-xs text-gray-600">2018</div>
                </div>
              </div>
            </div>
          </div>

          {/* Measurements Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Số đo thể hình
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Chiều cao</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  178 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Cân nặng</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  76 <span className="text-xs text-gray-600">kg</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Ngực</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  102 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Bắp tay</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  38 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Bụng</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  80 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Cẳng tay</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  29 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Đùi</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  58 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Bắp chuối</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  40 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Lịch hỗ trợ luyện tập
          </h3>

          <div className="space-y-3">
            {schedule.map((row, dayIndex) => (
              <div key={dayIndex} className="flex items-start gap-4 pb-3 border-b border-gray-100 last:border-0">
                <div className="text-sm font-medium text-gray-900 min-w-20">{row.day}</div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {row.slots.length === 0 ? (
                    <span className="text-sm text-gray-400 italic">Không có ca rảnh</span>
                  ) : (
                    row.slots.map((slot, slotIndex) => {
                      const key = `${dayIndex}-${slotIndex}`;
                      const isRemoved = removedSlots[key];
                      return (
                        <button
                          key={key}
                          onClick={() => toggleSlot(dayIndex, slotIndex)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer ${
                            isRemoved
                              ? 'bg-gray-100 text-gray-400 border-gray-200 line-through'
                              : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-50'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })
                  )}
                  <button
                    onClick={() => addSlot(dayIndex)}
                    className="px-3 py-1.5 text-xs text-gray-400 border border-dashed border-gray-300 rounded-full hover:border-gray-400 transition-colors"
                  >
                    + Thêm ca
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2.5 h-2.5 rounded-full bg-green-100 border border-green-200"></div>
              Ca rảnh (click để bỏ)
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-100 border border-gray-200"></div>
              Đã xóa
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-3 px-6 bg-white text-center text-xs text-gray-500">
        © 2026 ActiveGym Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default TrainerProfile;
