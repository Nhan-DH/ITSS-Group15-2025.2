import React from 'react';
import { cn } from '@/lib/utils';
import { UserPlus, CreditCard, Dumbbell, Calendar, Info } from 'lucide-react';

const getActivityIcon = (type) => {
  switch (type) {
    case 'registration': return { icon: UserPlus, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30' };
    case 'payment': return { icon: CreditCard, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' };
    case 'checkin': return { icon: Dumbbell, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30' };
    case 'booking': return { icon: Calendar, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30' };
    default: return { icon: Info, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-900/30' };
  }
};

const RecentActivities = ({ activities = [], className }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className={cn("rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", className)}>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Hoạt động gần đây</h3>
        <div className="mt-6 flex flex-col items-center justify-center p-6 text-center text-gray-500 dark:text-gray-400">
          <Info className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm">Chưa có hoạt động nào được ghi nhận.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", className)}>
      <h3 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">Hoạt động gần đây</h3>
      <div className="mt-6 space-y-6">
        {activities.map((activity, index) => {
          const { icon: Icon, color, bg } = getActivityIcon(activity.type);
          
          return (
            <div key={activity.id || index} className="flex gap-4">
              {/* Icon / Timeline dot */}
              <div className="relative">
                {/* Dây nối giữa các activity nếu ko phải last item */}
                {index !== activities.length - 1 && (
                  <span className="absolute left-1/2 top-10 -ml-px h-full w-0.5 bg-gray-100 dark:bg-gray-800" aria-hidden="true" />
                )}
                <div className={cn("relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-8 ring-white dark:ring-gray-950", bg, color)}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col pt-1.5 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                  {activity.user && <span className="font-semibold">{activity.user}</span>}
                  {' '}{activity.action}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="whitespace-nowrap">{activity.time}</span>
                  {activity.description && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span className="truncate">{activity.description}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivities;
