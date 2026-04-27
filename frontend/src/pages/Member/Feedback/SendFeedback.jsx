import React, { useCallback, useEffect, useState } from 'react';
import { Star, Send, Loader2, MessageSquareText, Clock3, CheckCircle2, Wrench } from 'lucide-react';
import Button from '@/components/Common/Button';
import { feedbackService } from '@/services/feedbackService';
import { memberService } from '@/services/memberService';
import Badge from '@/components/Common/Badge';

const feedbackCategories = [
  { value: 'equipment', label: 'Thiết bị máy tập' },
  { value: 'service', label: 'Dịch vụ và vệ sinh khu vực chung' },
  { value: 'staff', label: 'Nhân viên / Huấn luyện viên' },
  { value: 'other', label: 'Vấn đề khác' }
];

const ratingLabels = {
  1: 'Không hài lòng',
  2: 'Chưa hài lòng',
  3: 'Bình thường',
  4: 'Hài lòng',
  5: 'Rất hài lòng'
};

const feedbackTypeLabels = {
  equipment: 'Thiết bị máy tập',
  service: 'Dịch vụ và vệ sinh',
  staff: 'Nhân viên / Huấn luyện viên',
  trainer: 'Huấn luyện viên',
  other: 'Vấn đề khác',
};

const feedbackStatusMeta = {
  pending: {
    label: 'Chờ duyệt',
    variant: 'warning',
    icon: Clock3,
  },
  processing: {
    label: 'Đang xử lý',
    variant: 'primary',
    icon: Wrench,
  },
  resolved: {
    label: 'Đã xử lý',
    variant: 'success',
    icon: CheckCircle2,
  },
};

const getStatusMeta = (status) => {
  const normalized = String(status || '').toLowerCase();
  return feedbackStatusMeta[normalized] || {
    label: normalized || 'Chưa rõ',
    variant: 'default',
    icon: MessageSquareText,
  };
};

const getFeedbackTypeLabel = (type) => {
  const normalized = String(type || '').toLowerCase();
  return feedbackTypeLabels[normalized] || type || 'Khác';
};

const sortByNewest = (items) => {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.sent_at || a.sentAt || 0).getTime();
    const bTime = new Date(b.sent_at || b.sentAt || 0).getTime();
    return bTime - aTime;
  });
};

const SendFeedback = () => {
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('service');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  const loadMyFeedbacks = useCallback(async () => {
    try {
      setHistoryError(null);
      const response = await memberService.getMyFeedbacks();
      const data = response?.data ?? response;
      setFeedbacks(Array.isArray(data) ? sortByNewest(data) : []);
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 403) {
        setHistoryError('Tài khoản hiện tại không có quyền xem lịch sử phản hồi của hội viên.');
      } else if (status === 404) {
        setHistoryError('Tài khoản hiện tại chưa được liên kết với hồ sơ hội viên.');
      } else if (status === 500) {
        setHistoryError('Backend đang lỗi khi tải lịch sử phản hồi. Hãy kiểm tra server và schema Feedback.');
      } else {
        setHistoryError('Không thể tải lịch sử phản hồi.');
      }
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadMyFeedbacks();
  }, [loadMyFeedbacks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Vui lòng nhập ý kiến chi tiết.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await feedbackService.createFeedback({
        content,
        rating,
        feedback_type: category,
        status: 'pending',
      });
      setSuccess(true);
      setContent('');
      setRating(5);
      setCategory('service');
      await loadMyFeedbacks();
    } catch (err) {
      console.error(err);
      setError('Gửi phản hồi thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-3xl pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Góp Ý Dịch Vụ</h1>
        <p className="text-gray-500 text-sm mt-1">
          Chúng tôi luôn lắng nghe phản hồi của bạn để cải thiện môi trường tốt hơn.
        </p>
      </div>

      {success && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 text-sm font-medium">
          ✅ Phản hồi của bạn đã được gửi thành công. Cảm ơn bạn!
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-600 dark:bg-red-900/20 dark:border-red-800 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 shadow-sm">
        <div className="space-y-2 text-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
          <p className="font-bold text-lg dark:text-white mb-2">Đánh giá chung của bạn?</p>
          <div className="flex justify-center gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none p-1 transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`h-12 w-12 transition-colors ${
                    rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 font-medium uppercase tracking-wider">{ratingLabels[rating]}</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Chủ đề phản hồi</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
          >
            {feedbackCategories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ý kiến chi tiết</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex min-h-[140px] w-full rounded-xl border border-input bg-background px-4 py-3 resize-none focus:ring-2 focus:ring-blue-500"
            placeholder="Hãy viết góp ý thẳng thắn để chúng tôi phục vụ bạn tốt hơn..."
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl text-md font-bold"
          leftIcon={submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          disabled={submitting}
        >
          {submitting ? 'Đang gửi...' : 'Gửi Phản Hồi'}
        </Button>
      </form>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Phản hồi đã gửi</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Theo dõi trạng thái xử lý các góp ý của bạn.
            </p>
          </div>
          <Badge variant="primary">{feedbacks.length} phản hồi</Badge>
        </div>

        <div className="space-y-3">
          {loadingHistory ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải lịch sử phản hồi...
              </div>
            </div>
          ) : historyError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {historyError}
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-900/30">
              <MessageSquareText className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bạn chưa gửi phản hồi nào</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Khi bạn gửi góp ý, trạng thái xử lý sẽ xuất hiện tại đây.
              </p>
            </div>
          ) : (
            feedbacks.map((feedback) => {
              const statusMeta = getStatusMeta(feedback.status);
              const StatusIcon = statusMeta.icon;
              const sentAt = feedback.sent_at || feedback.sentAt;
              const resolutionNote = feedback.resolution_note || feedback.resolutionNote;

              return (
                <article
                  key={feedback.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="primary">{getFeedbackTypeLabel(feedback.feedback_type || feedback.feedbackType)}</Badge>
                        <Badge variant={statusMeta.variant} className="gap-1.5">
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusMeta.label}
                        </Badge>
                      </div>

                      <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {feedback.content}
                      </p>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              Number(feedback.rating) >= star
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 dark:text-gray-700'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                          {ratingLabels[Number(feedback.rating)] || `${feedback.rating}/5`}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
                      {sentAt ? new Date(sentAt).toLocaleString('vi-VN') : 'Không rõ ngày gửi'}
                    </div>
                  </div>

                  {resolutionNote && (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300">
                      <span className="font-semibold">Phản hồi từ hệ thống:</span> {resolutionNote}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default SendFeedback;
