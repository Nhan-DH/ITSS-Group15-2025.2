import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomSchema } from '@/schemas/roomSchemas';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';

const RoomFormComponent = ({ initialData, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: initialData || {
      name: '',
      capacity: 30,
      status: 'active',
      icon: '🏃',
      description: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tên Khu vực / Phòng tập *"
          placeholder="VD: Khu vực Cardio (Tầng 1)"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Icon (Biểu tượng) *"
          placeholder="VD: 🏃, 🏋️"
          error={errors.icon?.message}
          {...register('icon')}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Sức chứa tối đa (Người) *"
          type="number"
          min="1"
          error={errors.capacity?.message}
          {...register('capacity')}
        />
        
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Trạng thái hoạt động *</label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
            {...register('status')}
          >
            <option value="active">Đang mở cửa</option>
            <option value="maintenance">Bảo trì / Đóng cửa</option>
          </select>
          {errors.status && <span className="text-xs font-medium text-red-500">{errors.status.message}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Mô tả thêm / Ghi chú</label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white resize-y"
          placeholder="Nhập ghi chú hoặc mô tả về khu vực này..."
          {...register('description')}
        />
        {errors.description && <span className="text-xs font-medium text-red-500">{errors.description.message}</span>}
      </div>

      <div className="flex justify-end pt-4 border-t dark:border-gray-800">
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {initialData ? 'Lưu thay đổi' : 'Thêm Khu Vực Mới'}
        </Button>
      </div>
    </form>
  );
};

export default RoomFormComponent;
