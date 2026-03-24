import React from 'react';
import { Save, ShoppingCart, RefreshCw } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';

const RenewPackage = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/40 dark:text-green-400">
          <RefreshCw className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Gia hạn Gói tập</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tìm kiếm bằng mã thẻ MEM- và tiến hành gia hạn thời gian bảo lưu quyền lợi cho hội viên.
          </p>
        </div>
      </div>

      <form className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-1 col-span-1 md:col-span-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Cà mã thẻ hoặc SĐT Hội viên (*)</label>
            <div className="flex gap-2">
              <Input className="flex-1" placeholder="Quét mã vạch thẻ cứng hoặc số 09..." />
              <Button type="button" variant="secondary">Kiểm tra Info</Button>
            </div>
          </div>
          
          <div className="space-y-1 col-span-1 border border-blue-100 bg-blue-50/50 p-4 rounded-lg dark:border-blue-900/30 dark:bg-blue-950/20 md:col-span-2 hidden">
            {/* Card mô tả hội viên hiện ra khi tìm thấy (Giao diện tĩnh hidden mô phỏng) */}
          </div>

          <div className="space-y-1 col-span-1">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Hạng mục Gói Dịch Vụ Mới</label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
              <option value="1">Gói VIP 12 Tháng - 3.000.000 đ</option>
              <option value="2">Gói Cơ Bản 1 Tháng - 300.000 đ</option>
              <option value="3">Gói Nâng Cao 3 Tháng - 800.000 đ</option>
            </select>
          </div>

          <div className="space-y-1 col-span-1">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Phương thức chuyển tiền</label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
              <option value="transfer">QR Ngân hàng (Khuyên dùng)</option>
              <option value="cash">Tiền Mặt</option>
              <option value="card">Thẻ Tín Dụng Quẹt POS</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl mt-8 dark:bg-gray-900/50 dark:border-gray-800 flex justify-between items-center group">
            <span className="text-gray-700 font-medium dark:text-gray-300">Tổng thu tiền dự kiến:</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tight">3,000,000 đ</span>
        </div>
        
        <div className="flex justify-end pt-6">
          <Button leftIcon={<ShoppingCart className="h-4 w-4" />}>
            Xác nhận Thanh toán & Xuất hóa đơn
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RenewPackage;
