import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useMembers } from '@/hooks/queries/useMembers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';

const MemberList = () => {
  const { data: members, isLoading, isError } = useMembers();

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Danh sách Hội viên</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Quản lý tất cả danh sách người tập tại hệ thống của bạn.
          </p>
        </div>
        <Link to="/owner/members/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Thêm hội viên
          </Button>
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Lỗi khi tải dữ liệu hội viên. Vui lòng thử lại.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã HV</TableHead>
                <TableHead>Họ Tên</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 h-24">
                    Chưa có hội viên nào. Bấm "Thêm hội viên" để bắt đầu.
                  </TableCell>
                </TableRow>
              ) : (
                members?.map((member) => (
                  <TableRow key={member.id || member.memberCode}>
                    <TableCell className="font-medium text-blue-600 dark:text-blue-400">{member.memberCode}</TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{member.fullName}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell className="text-gray-500">{member.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        member.status === 'active' 
                          ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {member.status === 'active' ? 'Đang tập' : 'Hết hạn'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/owner/members/${member.id}`}>
                          <Button variant="ghost" size="icon" title="Xem chi tiết" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/owner/members/${member.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Chỉnh sửa" className="h-8 w-8 text-blue-500">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" title="Xóa" className="h-8 w-8 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default MemberList;
