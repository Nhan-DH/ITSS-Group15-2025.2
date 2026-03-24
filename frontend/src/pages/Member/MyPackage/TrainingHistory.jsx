import React from 'react';
import { CalendarCheck } from 'lucide-react';

const TrainingHistory = () => {
  const history = [
    { date: "22/03/2026", time: "17:45", type: "Check-in Lễ tân" },
    { date: "21/03/2026", time: "18:00", type: "Tập PT 1:1" },
    { date: "19/03/2026", time: "18:30", type: "Check-in Lễ tân" },
    { date: "17/03/2026", time: "19:00", type: "Lớp Yoga" },
  ];

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nhật ký Hoạt động</h1>
        <p className="text-gray-500 text-sm mt-1">Lịch sử ra vào cổng và tham gia lớp học của bạn.</p>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent dark:before:via-gray-700">
        {history.map((item, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-blue-100 text-blue-500 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:bg-blue-900/40 dark:border-gray-950 z-10">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col dark:bg-gray-950 dark:border-gray-800 transition-all hover:border-blue-300 hover:shadow-md">
              <span className="font-bold text-gray-900 dark:text-white">{item.type}</span>
              <div className="flex justify-between items-center mt-2">
                 <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-400">{item.time}</span>
                 <span className="text-xs text-gray-400 font-medium">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TrainingHistory;
