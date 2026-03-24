import { useQuery } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';

// Hook lấy danh sách tất cả hội viên
export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: () => memberService.getMembers(),
  });
};
