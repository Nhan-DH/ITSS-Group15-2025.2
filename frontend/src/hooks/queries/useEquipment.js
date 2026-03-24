import { useQuery } from '@tanstack/react-query';
import { equipmentService } from '@/services/equipmentService';

// Hook lấy trạng thái thiết bị phòng tập
export const useEquipment = () => {
  return useQuery({
    queryKey: ['equipment'],
    queryFn: () => equipmentService.getEquipments(),
  });
};
