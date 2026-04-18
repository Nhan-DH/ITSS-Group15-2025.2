import React, { useMemo, useState } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFeedbacks } from '@/hooks/queries/useFeedbacks';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Common/Table';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';

const FeedbackList = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 6;

  const { data: feedbackResponse, isLoading, isError } = useFeedbacks(page, limit, statusFilter);

  // Handle API response
  const feedbacks = useMemo(() => {
    if (!feedbackResponse) return [];
    if (Array.isArray(feedbackResponse)) return feedbackResponse;
    return feedbackResponse.data || feedbackResponse || [];
  }, [feedbackResponse]);

  const totalItems = useMemo(() => {
    if (!feedbackResponse) return 0;
    if (Array.isArray(feedbackResponse)) return feedbackResponse.length;
    return feedbackResponse.total_items || 0;
  }, [feedbackResponse]);

  const totalPages = useMemo(() => {
    if (!feedbackResponse) return 1;
    if (Array.isArray(feedbackResponse)) return 1;
    return feedbackResponse.total_pages || Math.ceil(totalItems / limit) || 1;
  }, [feedbackResponse, totalItems]);

  const filteredFeedbacks = useMemo(() => {
    const query = searchTerm.toLowerCase();
    const now = new Date();
    return feedbacks.filter((fb) => {
      const matchSearch = 
        (fb.member_name || fb.memberName || '').toLowerCase().includes(query) || 
        (fb.content || fb.Content || '').toLowerCase().includes(query);
      const matchRating = ratingFilter === 'all' || (fb.rating || fb.Rating || 0).toString() === ratingFilter;
      const feedbackDate = new Date(fb.created_at || fb.createdAt || fb.date || '2024-01-01');
      let matchDate = true;

      if (dateFilter === 'last7') {
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 7);
        matchDate = feedbackDate >= cutoff;
      }
      if (dateFilter === 'last30') {
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - 30);
        matchDate = feedbackDate >= cutoff;
      }
      if (dateFilter === 'thisMonth') {
        matchDate = feedbackDate.getMonth() === now.getMonth() && feedbackDate.getFullYear() === now.getFullYear();
      }
      if (dateFilter === 'thisYear') {
        matchDate = feedbackDate.getFullYear() === now.getFullYear();
      }

      return matchSearch && matchRating && matchDate;
    });
  }, [feedbacks, searchTerm, ratingFilter, dateFilter]);

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
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Phản hồi Hội viên</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Xem xét và cải thiện chất lượng dịch vụ dựa trên nhận xét của khách hàng.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm theo tên hoặc nội dung..." />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Lọc theo đánh giá</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="all">Tất cả</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Lọc theo trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="resolved">Đã xử lý</option>
            </select>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Lọc theo thời gian</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-slate-400 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            >
              <option value="all">Tất cả</option>
              <option value="last7">7 ngày qua</option>
              <option value="last30">30 ngày qua</option>
              <option value="thisMonth">Tháng này</option>
              <option value="thisYear">Năm nay</option>
            </select>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Tổng phản hồi</label>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Đang tải đánh giá...</div>
        ) : isError ? (
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
              {filteredFeedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 h-24">
                    Không tìm thấy phản hồi phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeedbacks.map((fb) => (
                  <TableRow key={fb.id}>
                    <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                      {fb.member_name || fb.memberName || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded dark:bg-blue-900/30 dark:text-blue-400 mb-2 inline-block">
                        {fb.feedback_type || fb.feedbackType || fb.type === 'trainer' ? 'Huấn luyện viên' : fb.type === 'equipment' ? 'Thiết bị' : fb.type === 'service' ? 'Dịch vụ' : fb.type || 'Khác'}
                      </span>
                      {renderStars(fb.rating || fb.Rating || 0)}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-gray-400" />
                        <span className="line-clamp-2 leading-relaxed">{fb.content || fb.Content || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-gray-500">
                      {fb.created_at || fb.createdAt || fb.date || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Trang {page} / {totalPages} (Tổng: {totalItems} phản hồi)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
