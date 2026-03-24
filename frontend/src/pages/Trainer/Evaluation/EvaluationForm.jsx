import React from 'react';
import { Save } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';

const EvaluationForm = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Nhật ký Đánh giá</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Note lại diễn biến thể trạng của học viên sau hoặc trong ca tập.</p>
      </div>

      <form className="border border-gray-200 bg-white p-6 shadow-sm md:p-8 rounded-xl dark:border-gray-800 dark:bg-gray-950 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Chọn Học Viên</label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed">
              <option>Nguyễn Tuấn A (PT 1:1)</option>
              <option>Lê Thị B (PT 1:1)</option>
            </select>
          </div>
          <Input label="Bài tập chính hôm nay" placeholder="Ngực / Lưng xô / Chân..." />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Đánh giá độ thích nghi / Ghi chú</label>
          <textarea className="flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập nhận xét về form tập, mức tạ, sức bền, điểm yếu cần rèn luyện thêm..."></textarea>
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
          <Button leftIcon={<Save className="h-4 w-4" />}>Lưu Đánh giá Hệ thống</Button>
        </div>
      </form>
    </div>
  );
};
export default EvaluationForm;
