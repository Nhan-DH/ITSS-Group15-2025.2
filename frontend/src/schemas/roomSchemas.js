import { z } from 'zod';

export const roomSchema = z.object({
  name: z.string().min(5, { message: 'Tên khu vực tập phải chứa ít nhất 5 ký tự' }),
  capacity: z.coerce.number().min(1, { message: 'Sức chứa tối thiểu 1 người' }).max(1000, { message: 'Sức chứa tối đa 1000 người' }),
  status: z.enum(['active', 'maintenance']).default('active'),
  icon: z.string().min(1, { message: 'Vui lòng chọn hoặc nhập Icon (VD: 🏃, 🏋️)' }),
  description: z.string().optional()
});
