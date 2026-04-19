import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';
import useTrainerStore from '@/store/useTrainerStore';

const StudentList = () => {
  const students = useTrainerStore((s) => s.students);

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Danh sách Học Viên Của Tôi</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Quản lý những học viên đang được bạn training trực tiếp.
            </p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Học Viên</TableHead>
                <TableHead>Mục tiêu</TableHead>
                <TableHead>Gói PT</TableHead>
                <TableHead>Số buổi còn lại</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/50 transition-colors">
                  <TableCell>
                    {/* Clickable name → StudentDetail */}
                    <Link
                      to={`/trainer/students/${student.id}`}
                      className="group flex items-center gap-2 w-fit"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                        {student.avatar || student.name.split(' ').slice(-2).map(w => w[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-blue-600 group-hover:text-blue-800 group-hover:underline transition-colors text-sm flex items-center gap-1">
                          {student.name}
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-xs text-gray-500 font-normal">{student.phone}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{student.goal}</TableCell>
                  <TableCell>{student.package}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${student.remaining <= 3 ? 'text-red-500' : 'text-blue-600'}`}>
                      {student.remaining}
                      {student.remaining <= 3 && <span className="ml-1 text-xs text-red-400 font-normal">⚠ Sắp hết</span>}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/trainer/students/${student.id}`}>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
