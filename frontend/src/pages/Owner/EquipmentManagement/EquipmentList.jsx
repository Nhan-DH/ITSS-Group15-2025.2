import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, PenTool } from 'lucide-react';
import { useEquipment } from '@/hooks/queries/useEquipment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';

const EquipmentList = () => {
  const { data: equipment, isLoading, isError } = useEquipment();

  // Mock data fallback
  const mockEquipment = equipment || [
    { id: 1, name: "Máy chạy bộ Proform", category: "Cardio", status: "active", condition: "Tốt", nextMaintenance: "15/05/2026" },
    { id: 2, name: "Ghế đẩy ngực Incline", category: "Free Weights", status: "active", condition: "Tốt", nextMaintenance: "20/06/2026" },
    { id: 3, name: "Máy kéo xô lưng đùi", category: "Machines", status: "maintenance", condition: "Đang sửa", nextMaintenance: "Đang tiến hành" },
    { id: 4, name: "Tạ đòn Olympic 20kg", category: "Free Weights", status: "active", condition: "Cũ", nextMaintenance: "30/12/2026" },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản lý Thiết bị</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Theo dõi tình trạng máy móc, thiết bị và lịch bảo trì.
          </p>
        </div>
        <Link to="/owner/equipment/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Thêm thiết bị
          </Button>
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải danh sách thiết bị...</div>
        ) : isError && !equipment ? (
          <div className="p-8 text-center text-red-500">Lỗi không thể lấy dữ liệu thiết bị.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên thiết bị / Thuộc máy</TableHead>
                <TableHead>Phân loại</TableHead>
                <TableHead>Trạng thái sửa chữa</TableHead>
                <TableHead>Bảo trì tiếp theo</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEquipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 h-24">
                    Chưa có thiết bị nào trong kho.
                  </TableCell>
                </TableRow>
              ) : (
                mockEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <PenTool className="h-4 w-4 text-gray-400" />
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Tình trạng: {item.condition}</div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {item.category}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        item.status === 'active' 
                          ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400' 
                          : 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {item.status === 'active' ? 'Hoạt động tốt' : 'Đang bảo trì'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {item.nextMaintenance}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/owner/equipment/${item.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Chỉnh sửa" className="h-8 w-8 text-blue-500 hidden sm:inline-flex">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" title="Xóa" className="h-8 w-8 text-red-500 hidden sm:inline-flex">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {/* Mobile view Action Fallback */}
                        <div className="sm:hidden text-blue-500 font-medium text-sm underline px-2 py-1">Sửa</div>
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

export default EquipmentList;
