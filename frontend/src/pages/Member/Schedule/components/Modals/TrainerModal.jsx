import React, { useMemo } from 'react';
import { X, Calendar, Clock, Award, Phone, Mail, ChevronRight, CheckCircle2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS_MAP = {
  'Mon': 'Thứ 2',
  'Tue': 'Thứ 3',
  'Wed': 'Thứ 4',
  'Thu': 'Thứ 5',
  'Fri': 'Thứ 6',
  'Sat': 'Thứ 7',
  'Sun': 'Chủ Nhật',
};

const TrainerModal = ({ selectedTrainer, ptDetails = [], setSelectedTrainer, setBookingForm }) => {
  if (!selectedTrainer) return null;

  const pt = ptDetails.find((p) => p.full_name === selectedTrainer);
  if (!pt) return null;

  const availability = useMemo(() => {
    if (!pt.available_schedule) return {};
    try {
      return JSON.parse(pt.available_schedule);
    } catch (e) {
      console.error("Failed to parse availability", e);
      return {};
    }
  }, [pt.available_schedule]);

  const hasAvailability = Object.keys(availability).some(day => availability[day]?.length > 0);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300 no-scrollbar">
      <div className="bg-white dark:bg-gray-950 rounded-[2rem] max-w-4xl w-full my-auto border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header với Gradient cao cấp */}
        <div className="h-32 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_-20%,#ffffff,transparent)]"></div>
          <button
            onClick={() => setSelectedTrainer(null)}
            className="absolute top-5 right-5 p-2.5 bg-black/10 hover:bg-black/20 text-white rounded-full transition-all backdrop-blur-md border border-white/10 group"
          >
            <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="px-8 pb-10 -mt-16 relative z-10">
          {/* Thông tin chính: Avatar & Tên */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end mb-10">
            <div className="h-36 w-36 rounded-3xl bg-white dark:bg-gray-900 p-2 shadow-2xl ring-4 ring-white/10 shrink-0">
              <div className="h-full w-full rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center text-5xl font-black text-blue-600 overflow-hidden border border-blue-100 dark:border-blue-800">
                {pt.avatar ? (
                  <img src={pt.avatar} alt={pt.full_name} className="h-full w-full object-cover" />
                ) : (
                  pt.full_name?.charAt(0)
                )}
              </div>
            </div>
            
            <div className="flex-1 pb-2">
              <div className="flex items-center flex-wrap gap-3 mb-2">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{pt.full_name}</h2>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase rounded-full tracking-wider">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified PT
                </div>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                <span className="flex items-center gap-2"><Award className="h-4.5 w-4.5 text-amber-500" /> {pt.experience_years || 0} năm kinh nghiệm</span>
                <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md"><Star className="h-4 w-4 fill-current" /> Sẵn sàng giảng dạy</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Cột trái: Nội dung giới thiệu & Lịch */}
            <div className="md:col-span-8 space-y-10">
              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-5 flex items-center gap-3">
                  <span className="h-1.5 w-6 bg-blue-600 rounded-full"></span>
                  Giới thiệu chuyên môn
                </h3>
                <div className="bg-gray-50/50 dark:bg-gray-900/30 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {pt.professional_profile || "Chưa có thông tin mô tả chi tiết từ huấn luyện viên."}
                  </p>
                  {pt.achievements && (
                    <div className="mt-5 pt-5 border-t border-gray-200/50 dark:border-gray-700/50 flex gap-4">
                      <div className="mt-1 text-xl flex-shrink-0">🏆</div>
                      <div className="space-y-2">
                        {pt.achievements.split(';').map((achievement, idx) => (
                          <p key={idx} className="text-sm font-medium text-gray-800 dark:text-gray-200 italic leading-snug">
                            {achievement.trim()}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-5 flex items-center gap-3">
                  <span className="h-1.5 w-6 bg-blue-600 rounded-full"></span>
                  Lịch biểu dạy học
                </h3>
                
                {hasAvailability ? (
                  <div className="grid gap-3">
                    {Object.entries(availability).map(([dayKey, slots]) => slots.length > 0 && (
                      <div key={dayKey} className="group flex gap-4 items-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <div className="w-20 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0">
                          {DAYS_MAP[dayKey]}
                        </div>
                        <div className="flex flex-wrap md:flex-nowrap gap-2 flex-1 overflow-x-auto no-scrollbar">
                          {slots.map(slot => (
                            <span key={slot} className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm whitespace-nowrap">
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
                    <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Huấn luyện viên chưa cập nhật lịch rảnh cố định.</p>
                  </div>
                )}
              </section>
            </div>

            {/* Cột phải: Liên hệ & CTA */}
            <div className="md:col-span-4 space-y-6">
              <div className="p-6 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent rounded-3xl border border-blue-100/50 dark:border-blue-900/20 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6">Thông tin liên hệ</h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 group">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 shadow-md border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Số điện thoại</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{pt.phone || "N/A"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 shadow-md border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Địa chỉ Email</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white break-words">{pt.email || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <button
                  onClick={() => {
                    setBookingForm({ ptId: pt.employee_id, trainer: pt.full_name });
                    setSelectedTrainer(null);
                  }}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.25rem] font-black text-sm transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.4)] hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <span className="relative z-10">ĐẶT LỊCH NGAY</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
                <div className="flex items-center gap-2 justify-center px-4">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <p className="text-[10px] font-medium text-gray-400 leading-relaxed">
                    Chọn khung giờ cụ thể sau khi nhấn Đặt lịch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerModal;

