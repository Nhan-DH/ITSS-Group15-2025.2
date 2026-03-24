import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';

const ScheduleList = () => {
  const schedule = [
    { id: 1, date: "Hôm nay, 18:00", student: "Nguyễn Tuấn A", status: "Chờ tập" },
    { id: 2, date: "Hôm nay, 19:30", student: "Lê Thị B", status: "Chờ tập" },
    { id: 3, date: "Hôm qua, 18:00", student: "Trần C", status: "Hoàn tất" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Lịch Dạy Học</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Quản lý các ca dạy cá nhân trong tuần.</p>
      </div>

      <div className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thời gian</TableHead>
              <TableHead>Học Viên</TableHead>
              <TableHead>Trạng thái Ca tập</TableHead>
              <TableHead className="text-right">Hành động Check-in</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-semibold text-gray-900 dark:text-white">{s.date}</TableCell>
                <TableCell>{s.student}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${s.status === 'Hoàn tất' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                    {s.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {s.status === 'Chờ tập' && <Button size="sm">Bắt đầu Ca Của Tôi</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default ScheduleList;
