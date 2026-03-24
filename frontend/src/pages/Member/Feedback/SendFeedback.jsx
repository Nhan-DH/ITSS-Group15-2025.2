import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import Button from '@/components/Common/Button';

const SendFeedback = () => {
  const [rating, setRating] = useState(5);
  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Góp ý Dịch vụ</h1>
        <p className="text-gray-500 text-sm mt-1">Chúng tôi luôn lắng nghe phản hồi của bạn để cải thiện môi trường tốt hơn.</p>
      </div>

      <form className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 shadow-sm">
        <div className="space-y-2 text-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
          <p className="font-bold text-lg dark:text-white mb-2">Đánh giá chung của bạn?</p>
          <div className="flex justify-center gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none p-1 transition-transform hover:scale-110 active:scale-95">
                <Star className={`h-12 w-12 transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 font-medium uppercase tracking-wider">{rating === 5 ? 'Tuyệt vời' : rating >= 3 ? 'Bình thường' : 'Tồi tệ'}</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Chủ đề phản hồi</label>
          <select className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500">
            <option>Trang thiết bị & Dụng cụ</option>
            <option>Thái độ Nhân viên/Huấn luyện viên</option>
            <option>Vệ sinh khu vực chung</option>
            <option>Vấn đề Khác</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ý kiến chi tiết</label>
          <textarea className="flex min-h-[140px] w-full rounded-xl border border-input bg-background px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500" placeholder="Hãy viết góp ý thẳng thắn để chúng tôi phục vụ bạn tốt hơn..."></textarea>
        </div>

        <Button className="w-full h-12 rounded-xl text-md font-bold" leftIcon={<Send className="h-5 w-5" />}>
          Gửi Định Giá Ngay
        </Button>
      </form>
    </div>
  );
};
export default SendFeedback;
