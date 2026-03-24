import axios from '@/lib/axios';

const IS_MOCK = true;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_PACKAGES = [
  { id: 1, name: 'Gói Cơ Bản', price: 500000, duration: 1, type: 'month', features: ['Gym', 'Tủ đồ'] },
  { id: 2, name: 'Gói VIP 3 Tháng', price: 1200000, duration: 3, type: 'month', features: ['Gym', 'Yoga', 'Xông hơi', 'Khăn tắm'] },
  { id: 3, name: 'Lớp Yoga Nhóm', price: 800000, duration: 1, type: 'month', features: ['Yoga 3 buổi/tuần'] },
];

export const packageService = {
  getPackages: async () => {
    if (IS_MOCK) {
      await delay(500);
      return MOCK_PACKAGES;
    }
    return axios.get('/packages');
  },

  getPackageById: async (id) => {
    if (IS_MOCK) {
      await delay(300);
      return MOCK_PACKAGES.find(p => p.id === parseInt(id));
    }
    return axios.get(`/packages/${id}`);
  },
  
  createPackage: async (data) => {
    if (IS_MOCK) {
      await delay(700);
      return { ...data, id: Date.now() };
    }
    return axios.post('/packages', data);
  },

  updatePackage: async (id, data) => {
    if (IS_MOCK) {
      await delay(700);
      return { id, ...data };
    }
    return axios.put(`/packages/${id}`, data);
  },

  deletePackage: async (id) => {
    if (IS_MOCK) {
      await delay(400);
      return { success: true };
    }
    return axios.delete(`/packages/${id}`);
  }
};
