import { useQuery } from '@tanstack/react-query';
import { feedbackService } from '@/services/feedbackService';

// Hook lấy danh sách khiếu nại/góp ý
export const useFeedbacks = () => {
  return useQuery({
    queryKey: ['feedbacks'],
    queryFn: () => feedbackService.getFeedbacks(),
  });
};
