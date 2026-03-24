import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Shield, UserCog } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';

const StaffList = () => {
  // Vì chưa có useStaffs, build mock data luôn
  const staffs = [
    { id: 1, name: "Nguyễn Lê Lễ Tân", role: "manager", phone: "0999888777", email: "letan@activegym.vn", status: "active" },
    { id: 2, name: "Trần Anh HLV", role: "trainer", phone: "0999666555", email: "pt.trananh@activegym.vn", status: "active" },
    { id: 3, name: "Phạm Tạp Vụ", role: "staff", phone: "0888111222", email: "tapvu@activegym.vn", status: "inactive" },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản lý Nhân sự</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quản lý tài khoản đăng nhập của Quản lý, Lễ tân và Huấn luyện viên cá nhân (PT).
          </p>
        </div>
        <Link to="/owner/staffs/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Thêm nhân sự
          </Button>
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Nhân viên</TableHead>
              <TableHead>Chức vụ (Role)</TableHead>
              <TableHead>Hỗ trợ liên lạc</TableHead>
              <TableHead>Trạng thái Cấp phép</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 h-24">
                  Chưa có nhân sự nào trong hệ thống.
                </TableCell>
              </TableRow>
            ) : (
              staffs.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <UserCog className="h-4 w-4" />
                    </div>
                    {staff.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      {staff.role === 'manager' && <Shield className="h-4 w-4 text-purple-500" />}
                      <span className="capitalize text-gray-700 dark:text-gray-300">
                        {staff.role === 'manager' ? 'Quản lý / Lễ tân' : staff.role === 'trainer' ? 'Huấn Luyện Viên' : 'Nhân sự khác'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 dark:text-gray-100">{staff.phone}</div>
                    <div className="text-xs text-gray-500">{staff.email}</div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                      staff.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                      {staff.status === 'active' ? 'Được phép đăng nhập' : 'Đã khóa'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/owner/staffs/${staff.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Phân quyền" className="h-8 w-8 text-blue-500 hidden sm:inline-flex">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" title="Cấm truy cập" className="h-8 w-8 text-red-500 hidden sm:inline-flex">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="sm:hidden text-blue-500 font-medium text-sm underline px-2 py-1">Sửa</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StaffList;
