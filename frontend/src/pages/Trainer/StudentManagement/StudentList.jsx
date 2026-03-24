import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, ClipboardEdit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';

const StudentList = () => {
  const students = [
    { id: 1, name: "Nguyễn Tuấn A", phone: "0901xxx", goal: "Giảm mỡ", package: "PT 1:1 - 36 Buổi", remaining: 12 },
    { id: 2, name: "Lê Thị B", phone: "0902xxx", goal: "Tăng cơ, độ mông", package: "PT 1:1 - 12 Buổi", remaining: 3 },
  ];

  return (
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
              <TableRow key={student.id}>
                <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{student.name} <div className="text-xs text-gray-500 font-normal">{student.phone}</div></TableCell>
                <TableCell>{student.goal}</TableCell>
                <TableCell>{student.package}</TableCell>
                <TableCell>
                  <span className={`font-bold ${student.remaining <= 3 ? 'text-red-500' : 'text-blue-600'}`}>
                    {student.remaining}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/trainer/students/${student.id}/progress`}>
                      <Button variant="outline" size="sm" leftIcon={<LineChart className="h-4 w-4" />}>
                        Inbody
                      </Button>
                    </Link>
                    <Link to={`/trainer/evaluation`}>
                      <Button variant="outline" size="sm" leftIcon={<ClipboardEdit className="h-4 w-4" />}>
                        Đánh giá
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
  );
};
export default StudentList;
