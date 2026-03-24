import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';

// Hook lấy báo cáo doanh thu theo chu kỳ
export const useRevenueReport = (period = 'month') => {
  return useQuery({
    queryKey: ['revenueReport', period],
    queryFn: () => reportService.getRevenueSummary(period),
  });
};

// Hook lấy báo cáo thống kê hội viên tổng thể
export const useMemberStats = () => {
  return useQuery({
    queryKey: ['memberStats'],
    queryFn: () => reportService.getMemberStats(),
  });
};
