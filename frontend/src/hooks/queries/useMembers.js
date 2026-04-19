import { useQuery } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';

// Hook lấy danh sách tất cả hội viên với pagination
export const useMembers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['members', page, limit],
    queryFn: () => memberService.getMembers(page, limit),
  });
};
