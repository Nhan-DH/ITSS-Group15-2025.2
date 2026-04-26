import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Shield, UserCog, Eye, EyeOff, Lock, Key, ChevronLeft, ChevronRight, Power, PowerOff } from 'lucide-react';
import { useEmployees } from '@/hooks/queries/useEmployees';
import { useDeleteEmployee, useUpdateEmployeeStatus, useUpdateEmployee } from '@/hooks/mutations/useEmployeeMutation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Modal from '@/components/Common/Modal';

const initialAccounts = [
  { id: 1, username: 'manager1', staff: 'Nguyễn Lê Lễ Tân', role: 'manager', password: 'L3Tan@123', status: 'active' },
  { id: 2, username: 'trainer1', staff: 'Trần Anh HLV', role: 'trainer', password: 'PTMinh!2026', status: 'active' },
  { id: 3, username: 'staff1', staff: 'Phạm Tạp Vụ', role: 'staff', password: 'TapVu#987', status: 'inactive' },
];

const StaffList = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, staff: null });
  const limit = 10;

  const { data: employeeResponse, isLoading, isError } = useEmployees(page, limit);
  const deleteMutation = useDeleteEmployee();
  const statusMutation = useUpdateEmployeeStatus();
  const updateMutation = useUpdateEmployee();

  const handleDelete = () => {
    if (deleteModal.staff) {
      deleteMutation.mutate(deleteModal.staff.id);
      setDeleteModal({ isOpen: false, staff: null });
    }
  };

  const handleToggleStatus = (staff) => {
    const newStatus = staff.status === 'active' ? 'inactive' : 'active';
    statusMutation.mutate({ id: staff.id, status: newStatus });
  };
  
  // Mock data fallback
  const mockStaffs = [
    { id: 1, full_name: 'Nguyễn Lê Lễ Tân', phone: '0999888777', email: 'letan@activegym.vn', position: 'Quản lý', status: 'active', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { id: 2, full_name: 'Trần Anh HLV', phone: '0999666555', email: 'pt.trananh@activegym.vn', position: 'Huấn luyện viên', status: 'active', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
    { id: 3, full_name: 'Phạm Tạp Vụ', phone: '0888111222', email: 'tapvu@activegym.vn', position: 'Nhân viên', status: 'inactive', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
    { id: 4, full_name: 'Nguyễn Thị Mai', phone: '0977555333', email: 'mai.pt@activegym.vn', position: 'Huấn luyện viên', status: 'active', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' },
    { id: 5, full_name: 'Trần Văn Bảo', phone: '0966444222', email: 'bao@activegym.vn', position: 'Lễ tân', status: 'active', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  ];

  // Handle employee API response
  const staffs = useMemo(() => {
    if (!employeeResponse) return mockStaffs;
    if (Array.isArray(employeeResponse)) return employeeResponse;
    if (employeeResponse.data && employeeResponse.data.length > 0) return employeeResponse.data;
    if (isError) return mockStaffs;
    return mockStaffs;
  }, [employeeResponse, isError]);

  const totalEmployeeItems = useMemo(() => {
    if (!employeeResponse) return mockStaffs.length;
    if (Array.isArray(employeeResponse)) return employeeResponse.length;
    return employeeResponse.total_items || mockStaffs.length;
  }, [employeeResponse]);

  const totalEmployeePages = useMemo(() => {
    if (!employeeResponse) return 1;
    if (Array.isArray(employeeResponse)) return 1;
    return employeeResponse.total_pages || Math.ceil(totalEmployeeItems / limit) || 1;
  }, [employeeResponse, totalEmployeeItems]);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [staffForm, setStaffForm] = useState(null);
  const [accounts] = useState(initialAccounts);
  const [accountSearch, setAccountSearch] = useState('');
  const [accountPasswordModal, setAccountPasswordModal] = useState({ isOpen: false, account: null, password: '' });
  const [revealedAccounts, setRevealedAccounts] = useState([]);
  const [passwordError, setPasswordError] = useState('');

  const filteredStaffs = useMemo(() => {
    const value = searchTerm.toLowerCase();
    return staffs.filter((staff) =>
      (staff.full_name || staff.FullName || staff.fullName || '').toLowerCase().includes(value) ||
      (staff.email || staff.Email || '').toLowerCase().includes(value) ||
      (staff.phone || staff.Phone || '').includes(value) ||
      (staff.position || staff.Position || '').toLowerCase().includes(value)
    );
  }, [searchTerm, staffs]);

  const filteredAccounts = useMemo(() => {
    const value = accountSearch.toLowerCase();
    return accounts.filter((account) =>
      account.username.toLowerCase().includes(value) ||
      account.staff.toLowerCase().includes(value) ||
      account.role.toLowerCase().includes(value)
    );
  }, [accountSearch, accounts]);

  const handleOpenStaffDetail = (staff) => {
    setSelectedStaff(staff);
    setStaffForm({ ...staff });
    setIsEditing(false);
    setIsStaffModalOpen(true);
  };

  const handleCloseStaffDetail = () => {
    setIsStaffModalOpen(false);
    setSelectedStaff(null);
    setStaffForm(null);
    setIsEditing(false);
  };

  const handleSaveStaff = () => {
    updateMutation.mutate({ id: staffForm.id, data: staffForm });
    setSelectedStaff(staffForm);
    setIsEditing(false);
  };

  const handlePasswordReveal = (account) => {
    setAccountPasswordModal({ isOpen: true, account, password: '' });
    setPasswordError('');
  };

  const handleConfirmPassword = () => {
    if (accountPasswordModal.password === 'owner123') {
      setRevealedAccounts((prev) => [...prev, accountPasswordModal.account.id]);
      setAccountPasswordModal({ isOpen: false, account: null, password: '' });
      setPasswordError('');
      return;
    }
    setPasswordError('Mật khẩu chủ phòng tập không đúng.');
  };

  const maskPassword = (value) => '•'.repeat(Math.max(8, value.length));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản lý Nhân sự</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Xem chi tiết nhân viên, cập nhật thông tin và tách riêng phần quản lý tài khoản.
          </p>
        </div>
        <Link to="/owner/staffs/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Thêm nhân sự
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Danh sách nhân sự</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tìm kiếm và mở chi tiết nhân viên để sửa thông tin.</p>
          </div>
          <div className="w-full max-w-sm">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên, email, SĐT, vị trí"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên nhân viên</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 h-24">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : filteredStaffs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 h-24">
                    Không tìm thấy nhân sự phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaffs.map((staff) => (
                  <TableRow key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer" onClick={() => handleOpenStaffDetail(staff)}>
                    <TableCell className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                      <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <img src={staff.photo || staff.Photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'} alt={staff.full_name || staff.FullName || staff.fullName} className="h-full w-full object-cover" />
                      </div>
                      {staff.full_name || staff.FullName || staff.fullName || 'N/A'}
                    </TableCell>
                    <TableCell>{staff.position || staff.Position || staff.role_id || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900 dark:text-gray-100">{staff.phone || staff.Phone || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{staff.email || staff.Email || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        staff.status === 'active' || staff.Status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {staff.status === 'active' || staff.Status === 'active' ? 'Hoạt động' : 'Ngừng'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Kích hoạt button removed as requested */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Xem chi tiết"
                          className="h-8 w-8 text-blue-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenStaffDetail(staff);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          title="Xóa"
                          className="h-8 w-8 text-red-500"
                          onClick={(e) => { e.stopPropagation(); setDeleteModal({ isOpen: true, staff }); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Employee Pagination */}
        {totalEmployeePages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Trang {page} / {totalEmployeePages} (Tổng: {totalEmployeeItems} nhân viên)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalEmployeePages, p + 1))}
                disabled={page === totalEmployeePages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quản lý Tài khoản nhân viên</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Danh sách tài khoản, mật khẩu ẩn và xác minh bằng mật khẩu chủ.</p>
          </div>
          <div className="w-full max-w-sm">
            <Input
              value={accountSearch}
              onChange={(e) => setAccountSearch(e.target.value)}
              placeholder="Tìm kiếm tài khoản theo tên, nhân viên, vai trò"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tài khoản</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Mật khẩu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 h-24">
                    Không có tài khoản phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{account.username}</TableCell>
                    <TableCell>{account.staff}</TableCell>
                    <TableCell className="capitalize">{account.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                        {revealedAccounts.includes(account.id) ? account.password : maskPassword(account.password)}
                        <button
                          onClick={() => handlePasswordReveal(account)}
                          className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          {revealedAccounts.includes(account.id) ? 'Ẩn' : 'Xem'}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        account.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {account.status === 'active' ? 'Kích hoạt' : 'Đã khóa'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/owner/staffs/${account.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Chỉnh sửa tài khoản" className="h-8 w-8 text-blue-500">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        isOpen={isStaffModalOpen}
        onClose={handleCloseStaffDetail}
        title={selectedStaff?.fullName || 'Chi tiết nhân sự'}
        description="Xem thông tin cá nhân và chỉnh sửa khi cần thiết."
        footer={
          <>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => { setIsEditing(false); setStaffForm(selectedStaff); }}>
                  Hủy
                </Button>
                <Button onClick={handleSaveStaff} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCloseStaffDetail}>Đóng</Button>
                <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
              </>
            )}
          </>
        }
      >
        {staffForm && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <img src={staffForm.photo || staffForm.Photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'} alt={staffForm.full_name || staffForm.fullName || 'Avatar'} className="h-20 w-20 rounded-2xl object-cover" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Vai trò</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{staffForm.position || staffForm.Position}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Họ tên</label>
                <input
                  value={staffForm.full_name || staffForm.fullName || staffForm.FullName || ''}
                  disabled={!isEditing}
                  onChange={(e) => setStaffForm({ ...staffForm, full_name: e.target.value, fullName: e.target.value })}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Giới tính</label>
                <input
                  value={staffForm.gender || staffForm.Gender || ''}
                  disabled={!isEditing}
                  onChange={(e) => setStaffForm({ ...staffForm, gender: e.target.value, Gender: e.target.value })}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Ngày sinh</label>
                <input
                  type="date"
                  value={staffForm.dob ? (staffForm.dob.split('T')[0] || staffForm.dob) : ''}
                  disabled={!isEditing}
                  onChange={(e) => setStaffForm({ ...staffForm, dob: e.target.value, DOB: e.target.value })}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Chức vụ</label>
                <input
                  value={staffForm.position || staffForm.Position || ''}
                  disabled={!isEditing}
                  onChange={(e) => setStaffForm({ ...staffForm, position: e.target.value, Position: e.target.value })}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">SĐT</label>
                <input
                  value={staffForm.phone || staffForm.Phone || ''}
                  disabled={!isEditing}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value, Phone: e.target.value })}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <input
                  value={staffForm.email || staffForm.Email || ''}
                  disabled={!isEditing}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value, Email: e.target.value })}
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Địa chỉ</label>
              <textarea
                value={staffForm.address || staffForm.Address || ''}
                disabled={!isEditing}
                onChange={(e) => setStaffForm({ ...staffForm, address: e.target.value, Address: e.target.value })}
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                rows={3}
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={accountPasswordModal.isOpen}
        onClose={() => setAccountPasswordModal({ isOpen: false, account: null, password: '' })}
        title="Xác minh mật khẩu chủ"
        description="Nhập lại mật khẩu chủ phòng tập để xem mật khẩu tài khoản nhân viên."
        footer={
          <>
            <Button variant="outline" onClick={() => setAccountPasswordModal({ isOpen: false, account: null, password: '' })}>Hủy</Button>
            <Button onClick={handleConfirmPassword}>Xác nhận</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Mật khẩu chủ</label>
            <input
              type="password"
              value={accountPasswordModal.password}
              onChange={(e) => setAccountPasswordModal({ ...accountPasswordModal, password: e.target.value })}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, staff: null })}
        title="Xác nhận xóa nhân viên"
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Bạn có chắc chắn muốn xóa nhân viên <strong>{deleteModal.staff?.full_name}</strong> không?
          </p>
          <p className="text-sm text-red-500 mb-4">Hành động này không thể hoàn tác.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, staff: null })}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StaffList;
