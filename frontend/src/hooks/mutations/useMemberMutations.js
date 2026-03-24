import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '@/services/memberService';
import { toast } from 'sonner';

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newMember) => memberService.createMember(newMember),
    onSuccess: () => {
      // Xóa cache cũ đi để gọi lại danh sách mới nhất
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Đã thêm hội viên thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi thêm hội viên');
    }
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => memberService.updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Cập nhật thông tin thành công!');
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => memberService.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Đã xóa hội viên khỏi hệ thống');
    },
  });
};
