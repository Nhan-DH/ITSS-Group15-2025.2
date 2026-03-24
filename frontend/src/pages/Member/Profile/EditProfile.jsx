import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';

const EditProfile = () => {
  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/member/profile">
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 shadow-sm rounded-full"><ArrowLeft className="h-5 w-5 text-gray-600" /></Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cập Nhật Hồ Sơ</h1>
      </div>

      <form className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm dark:bg-gray-950 dark:border-gray-800 space-y-6">
        <div className="pb-4 border-b border-gray-100 dark:border-gray-800 mb-6 flex justify-center">
            <div className="relative group cursor-pointer">
              <div className="h-28 w-28 rounded-full bg-gray-100 border-4 border-gray-50 shadow-inner flex items-center justify-center overflow-hidden dark:bg-gray-900 dark:border-gray-950">
                 <RefreshCw className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <p className="text-center text-xs font-semibold text-blue-600 mt-3">Thay Ảnh Đại Diện</p>
            </div>
        </div>

        <Input label="Họ và Tên (*)" defaultValue="Nguyễn Tuấn A" />
        <Input label="Số điện thoại (*)" defaultValue="0901234567" type="tel" />
        <Input label="Email đăng nhập" defaultValue="tuana@gym.com" type="email" />
        
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ngày tháng năm sinh</label>
          <input type="date" className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-950 dark:text-white" defaultValue="2000-01-01" />
        </div>

        <Input label="Địa chỉ hiện tại" defaultValue="Số 123 Đường B, Phường C, Quận 1, TPHCM" />
        
        <div className="pt-6 mt-4">
          <Button className="w-full h-12 text-lg font-bold rounded-xl shadow-md" leftIcon={<Save className="h-5 w-5" />}>Lưu Thông Tin Mới</Button>
        </div>
      </form>
    </div>
  );
};
export default EditProfile;
