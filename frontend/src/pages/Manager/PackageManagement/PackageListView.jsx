import React from 'react';
import { Package } from 'lucide-react';
import { usePackages } from '@/hooks/queries/usePackages';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';

const PackageListView = () => {
  const { data: packages, isLoading, isError } = usePackages();

  // Mock data fallback if API is not ready
  const mockPackages = packages || [
    { id: 1, name: "Gói 1 Tháng Cơ Bản", price: 300000, duration: 1, type: "Cơ bản", features: ["Khu vực Gym", "Tủ locker"] },
    { id: 2, name: "Gói 6 Tháng Tặng 1", price: 1800000, duration: 7, type: "Tiết kiệm", features: ["Khu vực Gym", "Yoga cơ bản"] },
    { id: 3, name: "Gói 12 Tháng VIP", price: 3000000, duration: 12, type: "VIP", features: ["Full dịch vụ VIP", "Lớp nhảy Zumba", "Xông hơi", "Khăn tập Free"] },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Báo Giá Gói Tập</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Hệ thống tra cứu thông tin Gói dịch vụ thẻ (Chỉ Xem) để Quản lý tư vấn khách hàng.
          </p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang đồng bộ dữ liệu Bảng Giá...</div>
        ) : isError && !packages ? (
           <div className="p-8 text-center text-red-500">Lỗi kết nối CSDL Bảng Giá.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Gói Dịch Vụ</TableHead>
                <TableHead>Phân Hạng</TableHead>
                <TableHead>Đơn Giá (VND)</TableHead>
                <TableHead>Thời Hạn</TableHead>
                <TableHead className="w-[30%]">Quyền lợi bao gồm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                       <Package className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                       {pkg.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                        pkg.type === 'VIP' ? 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-800' : 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800'
                    }`}>
                      {pkg.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
                      {new Intl.NumberFormat('vi-VN').format(pkg.price)} đ
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-gray-600 dark:text-gray-300">
                    {pkg.duration} tháng
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    <ul className="list-disc pl-4 space-y-1">
                      {pkg.features.map((feature, idx) => (
                         <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
export default PackageListView;
