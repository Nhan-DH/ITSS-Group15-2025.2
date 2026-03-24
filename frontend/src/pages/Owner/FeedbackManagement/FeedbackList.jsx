import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useFeedbacks } from '@/hooks/queries/useFeedbacks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';

const FeedbackList = () => {
  const { data: feedbacks, isLoading, isError } = useFeedbacks();

  // Mock list Feedback
  const mockFeedbacks = feedbacks || [
    { id: 1, memberName: "Nguyễn Văn A", rating: 5, category: "Thiết bị", content: "Máy chạy bộ mới đầu tư rất tốt.", date: "22/03/2026" },
    { id: 2, memberName: "Trần Thị B", rating: 2, category: "Dịch vụ", content: "Nhà vệ sinh buổi tối hơi dơ, cần vệ sinh liên tục.", date: "20/03/2026" },
    { id: 3, memberName: "Lê Văn C", rating: 4, category: "HLV Đào tạo", content: "PT chỉ nhiệt tình.", date: "15/03/2026" },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Phản hồi Hội viên</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Xem xét và cải thiện chất lượng dịch vụ dựa trên nhận xét của khách hàng.
          </p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải đánh giá...</div>
        ) : isError && !feedbacks ? (
          <div className="p-8 text-center text-red-500">Lỗi không thể tải dữ liệu đánh giá.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hội viên</TableHead>
                <TableHead>Loại phản hồi / Đánh giá</TableHead>
                <TableHead className="w-[45%]">Nội dung</TableHead>
                <TableHead className="text-right">Ngày gửi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFeedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 h-24">
                    Chưa có phản hồi nào.
                  </TableCell>
                </TableRow>
              ) : (
                mockFeedbacks.map((fb) => (
                  <TableRow key={fb.id}>
                    <TableCell className="font-semibold text-gray-900 dark:text-gray-100">{fb.memberName}</TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-400 mb-2 inline-block">
                        {fb.category}
                      </span>
                      {renderStars(fb.rating)}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-gray-400" />
                        <span className="line-clamp-2 leading-relaxed">{fb.content}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-gray-500">
                      {fb.date}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
