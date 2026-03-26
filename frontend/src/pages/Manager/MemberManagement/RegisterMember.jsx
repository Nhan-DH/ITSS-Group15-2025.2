import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberFormComponent from '@/components/Forms/MemberForm';
import { UserPlus } from 'lucide-react';
import { toast } from '@/utils/toast';

const RegisterMember = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Đã tạo hội viên mới thành công!');
      navigate('/manager/members');
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
          <UserPlus className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Khởi tạo Thẻ mới</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Điền hồ sơ và phát hành thẻ phòng tập ngay cho khách hàng đang đứng tại quầy.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950">
        <MemberFormComponent 
          initialData={null} 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default RegisterMember;
