import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { feedbackSchema } from '@/schemas/feedbackSchemas';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';

const FeedbackForm = ({ initialData, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: initialData || {
      title: '',
      content: '',
      category: 'service',
      rating: 5,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Tiêu đề (Tóm tắt sự cố) *"
        placeholder="VD: Phòng locker nam có vòi sen bị hỏng..."
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Đánh giá chung (Phân loại) *</label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
            {...register('category')}
          >
            <option value="service">Chất lượng Dịch vụ lễ tân</option>
            <option value="equipment">Thiết bị máy tập</option>
            <option value="staff">Về Nhân viên / Huấn luyện viên PT</option>
            <option value="other">Vệ sinh và các Vấn đề khác</option>
          </select>
          {errors.category && <span className="text-xs font-medium text-red-500">{errors.category.message}</span>}
        </div>
        
        <Input
          label="Mức độ Hài lòng (1 đến 5 sao)"
          type="number"
          min="1"
          max="5"
          placeholder="5"
          error={errors.rating?.message}
          {...register('rating')}
        />
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Nội dung phản ánh chi tiết *</label>
        <textarea
          className="flex min-h-[140px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white resize-y"
          placeholder="Anh/chị vui lòng mô tả chi tiết bất tiện gặp phải hoặc kinh nghiệm tập luyện cần Ban Quản Lý giải quyết..."
          {...register('content')}
        />
        {errors.content && <span className="text-xs font-medium text-red-500">{errors.content.message}</span>}
      </div>

      <div className="flex justify-end pt-4 border-t dark:border-gray-800">
        <Button type="submit" variant="primary" isLoading={isLoading} className="w-full sm:w-auto">
          Gửi Phản Hồi Điện Tử
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
