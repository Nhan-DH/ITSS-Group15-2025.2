import React from 'react';
import { User, Phone, Mail, MapPin, Edit3, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Common/Button';

const ProfileInfo = () => {
  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tài Khoản</h1>
        <Link to="/member/profile/edit">
          <Button variant="outline" size="sm" className="rounded-full px-5 font-semibold shadow-sm text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40" leftIcon={<Edit3 className="h-4 w-4" />}>Chỉnh sửa</Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-950 dark:border-gray-800">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 w-full relative">
           <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Đã xác thực
           </div>
           <div className="absolute -bottom-12 left-6 h-28 w-28 rounded-full border-[5px] border-white dark:border-gray-950 bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
              <User className="h-14 w-14 text-gray-400" />
           </div>
        </div>
        <div className="pt-16 pb-6 px-6 sm:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Nguyễn Tuấn A</h2>
          <p className="text-blue-600 font-mono text-sm font-semibold tracking-wide mt-1">MEM-982312</p>

          <div className="mt-8 space-y-5">
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="bg-gray-50 p-2.5 rounded-xl dark:bg-gray-900 text-gray-500">
                <Phone className="h-5 w-5" /> 
              </div>
              <span className="font-medium text-lg leading-none">090 123 4567</span>
            </div>
            
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="bg-gray-50 p-2.5 rounded-xl dark:bg-gray-900 text-gray-500">
                <Mail className="h-5 w-5" /> 
              </div>
              <span className="font-medium text-gray-600 dark:text-gray-400 leading-none">tuana@gym.com</span>
            </div>
            
            <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
              <div className="bg-gray-50 p-2.5 rounded-xl dark:bg-gray-900 text-gray-500 shrink-0">
                <MapPin className="h-5 w-5" /> 
              </div>
              <span className="font-medium text-gray-600 dark:text-gray-400 leading-snug">Số 123 Đường B, Phường C, Quận 1, TPHCM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileInfo;
