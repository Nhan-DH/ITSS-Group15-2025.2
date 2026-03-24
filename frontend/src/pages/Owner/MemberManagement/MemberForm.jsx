import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MemberFormComponent from '@/components/Forms/MemberForm';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/Common/Button';

const MemberFormPage = () => {
  const { id } = useParams();
  const isEditing = !!id;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link to="/owner/members">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isEditing ? 'Chỉnh sửa Hội viên' : 'Thêm mới Hội viên'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing ? 'Cập nhật các thông tin cá nhân của hội viên.' : 'Điền đầy đủ các thông tin cá nhân và gói tập ban đầu thiết lập cho hội viên.'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950">
        {/* Render component tái sử dụng */}
        <MemberFormComponent isEditing={isEditing} memberId={id} />
      </div>
    </div>
  );
};

export default MemberFormPage;
