import React from 'react';
import { Star, MessageSquare, CheckCircle } from 'lucide-react';
import { useFeedbacks } from '@/hooks/queries/useFeedbacks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Button from '@/components/Common/Button';

const FeedbackList = () => {
  const { data: feedbacks } = useFeedbacks();

  const mockFeedbacks = feedbacks || [
    { id: 1, memberName: "Nguyễn Văn A", rating: 5, category: "Thiết bị", content: "Chất lượng máy móc rất ok.", date: "22/03/2026", status: "pending" },
    { id: 2, memberName: "Trần Thị B", rating: 2, category: "Dịch vụ", content: "Nhà vệ sinh thiếu giấy hôm 10h tối qua.", date: "20/03/2026", status: "resolved" },
  ];

  const renderStars = (rating) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Kiểm soát Chất lượng</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Phản hồi nhanh các bất cập trong quá trình hội viên tham gia tập để đảm bảo CSKH tốt nhất.
          </p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-950 dark:ring-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách Hàng</TableHead>
              <TableHead>Chuyên mục</TableHead>
              <TableHead className="w-[45%]">Nội dung báo cáo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Dành cho Lễ tân</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFeedbacks.map((fb) => (
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
                    <span>{fb.content}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {fb.status === 'resolved' ? (
                     <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded dark:bg-green-900/30 dark:text-green-400">Đã fix xong</span>
                  ) : (
                     <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded dark:bg-amber-900/30 dark:text-amber-400">Mới nhận</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {fb.status !== 'resolved' && (
                     <Button size="sm" variant="outline" leftIcon={<CheckCircle className="h-4 w-4"/>}>Done</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FeedbackList;
