import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Vui lòng nhập email')
    .email('Email không đúng định dạng'),
  password: z.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

// Có thể thêm registerSchema, forgotPasswordSchema sau này
