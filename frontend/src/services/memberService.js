import axios from '@/lib/axios';

const IS_MOCK = false; // Set to false to use real API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_MEMBERS = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', createdAt: '2026-01-15', expiredAt: '2025-12-30', status: 'active', package: 'Gói VIP (Kèm PT)' },
  { id: 2, name: 'Trần Thị B', phone: '0912345678', createdAt: '2026-02-03', expiredAt: '2025-05-15', status: 'active', package: 'Gói Cơ Bản' },
  { id: 3, name: 'Lê Văn C', phone: '0923456789', createdAt: '2025-12-20', expiredAt: '2024-01-01', status: 'expired', package: 'Lớp Nhóm' },
];

export const memberService = {
  getMembers: async (page = 1, limit = 6) => {
    if (IS_MOCK) {
      await delay(600);
      return { data: MOCK_MEMBERS, total: MOCK_MEMBERS.length, page, limit };
    }
    const response = await axios.get(`/members?page=${page}&limit=${limit}`);
    return response;
  },

  getMemberDetail: async (id) => {
    if (IS_MOCK) {
      await delay(600);
      return { id: 1, name: 'Mock Member', phone: '0901234567' };
    }
    const response = await axios.get(`/members/${id}`);
    return response;
  },

  createMember: async (data) => {
    if (IS_MOCK) {
      await delay(800);
      return { ...data, id: Date.now() };
    }
    return axios.post('/members', data);
  },

  updateMember: async (id, data) => {
    if (IS_MOCK) {
      await delay(800);
      return { id, ...data };
    }
    return axios.put(`/members/${id}`, data);
  },

  updateMemberStatus: async (id, isActive) => {
    if (IS_MOCK) {
      await delay(500);
      return { id, is_active: isActive };
    }
    return axios.put(`/members/${id}/status`, { is_active: isActive });
  },

  deleteMember: async (id) => {
    if (IS_MOCK) {
      await delay(500);
      return { success: true };
    }
    return axios.delete(`/members/${id}`);
  },

  // --- Member self-service APIs ---

  getMe: async () => {
    return axios.get('/members/me');
  },

  updateMe: async (data) => {
    return axios.put('/members/me', data);
  },

  getMyTrainingHistory: async () => {
    return axios.get('/members/me/training-history');
  },

  getMySchedule: async () => {
    return axios.get('/members/me/schedule');
  },

  getMyFeedbacks: async () => {
    return axios.get('/members/me/feedbacks');
  },
};
