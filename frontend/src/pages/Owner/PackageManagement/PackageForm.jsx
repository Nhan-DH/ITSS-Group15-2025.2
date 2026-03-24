import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PackageFormComponent from '@/components/Forms/PackageForm';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/Common/Button';

const PackageFormPage = () => {
  const { id } = useParams();
  const isEditing = !!id;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link to="/owner/packages">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isEditing ? 'Chỉnh sửa Gói tập' : 'Thiết lập Gói tập mới'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing 
              ? 'Thay đổi thông tin, giá bán hoặc mô tả của gói tập này.' 
              : 'Thêm dịch vụ thẻ tập mới vào hệ thống chi nhánh của bạn.'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950">
        {/* Component Dùng Xuyên Suốt từ `src/components/Forms` */}
        <PackageFormComponent isEditing={isEditing} packageId={id} />
      </div>
    </div>
  );
};

export default PackageFormPage;
