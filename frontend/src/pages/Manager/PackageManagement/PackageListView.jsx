import React from 'react';
import { usePackages } from '@/hooks/queries/usePackages';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import { formatPriceVND } from '@/utils/formatters';

const PackageList = () => {
  const { data: packages, isLoading, isError } = usePackages();

  // Tạo mock data fallback cho tình huống usePackages hook chưa có data thật
  const mockPackages = packages || [
    { id: 1, name: "Gói Cơ Bản", duration: 1, durationUnit: "Tháng", price: 300000, status: "active", features: ["Phòng gym cơ bản", "Yoga"] },
    { id: 2, name: "Gói Nâng Cao", duration: 3, durationUnit: "Tháng", price: 800000, status: "active", features: ["Tất cả khu vực", "Tủ đồ cá nhân"] },
    { id: 3, name: "Gói VIP (1 Năm)", duration: 12, durationUnit: "Tháng", price: 3000000, status: "active", features: ["HLV cá nhân 2 buổi", "Massge", "Sauna"] },
    { id: 4, name: "Gói Trải Nghiệm", duration: 7, durationUnit: "Ngày", price: 100000, status: "inactive", features: ["Dùng thử giới hạn"] },
  ];

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Danh sách Gói tập</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Xem các dịch vụ gói tập do Gym cung cấp.
          </p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải biểu giá...</div>
        ) : isError && !packages ? (
          <div className="p-8 text-center text-red-500">Lỗi lấy dữ liệu Gói tập.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Gói</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead>Giá (VND)</TableHead>
                <TableHead>Mô tả ngắn</TableHead>
                <TableHead>Trạng Thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPackages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 h-24">
                    Chưa có cấu hình gói tập nào.
                  </TableCell>
                </TableRow>
              ) : (
                mockPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{pkg.name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      {pkg.duration} {pkg.durationUnit}
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatPriceVND ? formatPriceVND(pkg.price) : `${pkg.price.toLocaleString('vi-VN')} đ`}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-[200px] truncate">
                      {pkg.features?.join(", ")}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${pkg.status === 'active'
                        ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-50 text-gray-600 ring-gray-600/20 dark:bg-gray-800/50 dark:text-gray-400'
                        }`}>
                        {pkg.status === 'active' ? 'Đang bán' : 'Bị ẩn'}
                      </span>
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

export default PackageList;
