import { useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService } from '@/services/equipmentService';
import { toast } from 'sonner';

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => equipmentService.createEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      toast.success('Thêm thiết bị mới thành công!');
    },
  });
};

export const useUpdateEquipmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => equipmentService.updateEquipmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      toast.success('Cập nhật trạng thái thiết bị thành công!');
    },
  });
};

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => equipmentService.deleteEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      toast.success('Đã xóa thiết bị');
    },
  });
};
