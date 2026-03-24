import React from 'react';
import { cn } from '@/lib/utils';
import { CalendarClock, MapPin, Users } from 'lucide-react';

const UpcomingSchedules = ({ schedules = [], className }) => {
  return (
    <div className={cn("rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">Lịch tập sắp tới</h3>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          Xem tất cả
        </button>
      </div>

      <div className="space-y-4 mt-2">
        {schedules.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border border-dashed rounded-lg border-gray-200 dark:border-gray-800">
            Không có lịch hẹn nào sắp tới.
          </div>
        ) : (
          schedules.map((schedule, index) => (
            <div 
              key={schedule.id || index} 
              className="group flex flex-col gap-2 rounded-lg border border-gray-100 p-4 transition-all hover:border-blue-100 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-900/50 dark:hover:bg-blue-900/10"
            >
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {schedule.title}
                </h4>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  schedule.type === 'pt' ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                )}>
                  {schedule.type === 'pt' ? 'Kèm 1-1' : 'Lớp nhóm'}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <div className="flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" />
                  <span>{schedule.time}</span>
                </div>
                {schedule.room && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{schedule.room}</span>
                  </div>
                )}
                {schedule.trainer && (
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    <span>PT: {schedule.trainer}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingSchedules;
