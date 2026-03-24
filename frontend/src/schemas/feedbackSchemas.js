import { z } from 'zod';

export const feedbackSchema = z.object({
  title: z.string().min(5, "Tiêu đề quá ngắn (Cần tóm tắt vấn đề)"),
  content: z.string().min(10, "Vui lòng mô tả chi tiết hơn (ít nhất 10 ký tự) để ban quản lý có thể hỗ trợ kịp thời."),
  category: z.enum(['equipment', 'service', 'staff', 'other']),
  rating: z.coerce.number().min(1).max(5).optional(),
});
