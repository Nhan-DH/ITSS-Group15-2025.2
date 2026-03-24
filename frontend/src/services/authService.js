import axios from '@/lib/axios';

// Dành cho MOCK API nếu backend chưa chạy
const IS_MOCK = true;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (credentials) => {
    if (IS_MOCK) {
      await delay(800);
      
      // Giả lập logic kiểm tra role theo email login
      let role = 'member';
      if (credentials.email.includes('owner')) role = 'owner';
      else if (credentials.email.includes('manager')) role = 'manager';
      else if (credentials.email.includes('trainer')) role = 'trainer';

      if (credentials.password === '123456') {
        return {
          user: { id: 1, email: credentials.email, fullName: 'Người dùng ' + role.toUpperCase(), role },
          token: 'mock-jwt-token-abcd-1234'
        };
      }
      throw new Error('Sai email hoặc mật khẩu!');
    }
    return axios.post('/auth/login', credentials);
  },

  register: async (data) => {
    if (IS_MOCK) {
      await delay(1000);
      return { message: 'Đăng ký thành công', id: Math.random() };
    }
    return axios.post('/auth/register', data);
  },

  getCurrentUser: async () => {
    if (IS_MOCK) {
      await delay(500);
      return { id: 1, email: 'owner@activegym.vn', fullName: 'Chủ phòng tập', role: 'owner' };
    }
    return axios.get('/auth/me');
  },
};
