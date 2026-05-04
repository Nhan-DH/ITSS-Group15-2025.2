import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';

const StudentList = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    { 
      id: 1, 
      name: "Nguyễn Tuấn A", 
      phone: "0901 234 567", 
      goal: "Giảm mỡ", 
      package: "PT 1:1 - 36 Buổi", 
      remaining: 12,
      email: "tuana@gym.com",
      age: 28,
      startDate: "2026-01-15",
      measurements: {
        height: 175,
        weight: 85,
        chest: 100,
        waist: 90,
        hip: 95
      }
    },
    { 
      id: 2, 
      name: "Lê Thị B", 
      phone: "0902 345 678", 
      goal: "Tăng cơ, độ mông", 
      package: "PT 1:1 - 12 Buổi", 
      remaining: 3,
      email: "leB@gym.com",
      age: 26,
      startDate: "2026-02-20",
      measurements: {
        height: 162,
        weight: 56,
        chest: 82,
        waist: 68,
        hip: 92
      }
    },
  ];

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell 
                    className="font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setSelectedStudent(student)}
                  >
                    {student.name} 
                    <div className="text-xs text-gray-500 font-normal">{student.phone}</div>
                  </TableCell>
                  <TableCell>{student.goal}</TableCell>
                  <TableCell>{student.package}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${student.remaining <= 3 ? 'text-red-500' : 'text-blue-600'}`}>
                      {student.remaining}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Student Information Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-950">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thông tin học viên</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Họ và tên</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedStudent.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Tuổi</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedStudent.age}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Số điện thoại</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedStudent.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Email</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedStudent.email}</p>
                  </div>
                </div>
              </div>

              {/* Training Info */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                  Thông tin tập luyện
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Mục tiêu</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{selectedStudent.goal}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Gói PT</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{selectedStudent.package}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Ngày bắt đầu</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{selectedStudent.startDate}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                    <label className="text-xs text-blue-600 dark:text-blue-400">Buổi còn lại</label>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{selectedStudent.remaining}</p>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                  Số đo thể hình
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Chiều cao</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{selectedStudent.measurements.height} cm</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Cân nặng</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{selectedStudent.measurements.weight} kg</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Ngực</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{selectedStudent.measurements.chest} cm</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Vòng eo</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{selectedStudent.measurements.waist} cm</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <label className="text-xs text-gray-500 dark:text-gray-400">Vòng hông</label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{selectedStudent.measurements.hip} cm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
