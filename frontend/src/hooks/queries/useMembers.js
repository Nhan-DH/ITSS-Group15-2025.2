import { useQuery } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';

// Hook lấy danh sách tất cả hội viên với pagination
export const useMembers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['members', page, limit],
    queryFn: () => memberService.getMembers(page, limit),
  });
};

// Hook lấy chi tiết một hội viên
export const useMemberDetails = (id) => {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => memberService.getMemberDetail(id),
    enabled: !!id, // Chỉ gọi API khi có id
  });
};
